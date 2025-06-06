import express from 'express';
import dotenv from 'dotenv';
import shopify from './shopify.js';
import pool from './db.js';
import redis from './cache.js';
import es, { refreshSynonyms } from './es.js';
import { indexQueue, startIndexer } from './indexer.js';
import * as promClient from 'prom-client';

dotenv.config();

const app = express();
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });
const searchHistogram = new promClient.Histogram({
  name: 'search_request_duration_seconds',
  help: 'Duration of /search requests in seconds',
  buckets: [0.1, 0.3, 0.5, 1, 2, 5]
});
register.registerMetric(searchHistogram);

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
// Parse raw webhook bodies before JSON middleware to verify signatures
app.use('/webhooks', express.raw({ type: 'application/json' }));
app.use(express.json());

app.get('/auth', async (req, res) => {
  const shop = req.query.shop;
  if (!shop) return res.status(400).send('Missing shop parameter');
  const authRoute = await shopify.auth.begin({
    shop,
    callbackPath: '/auth/callback',
    isOnline: false,
    rawRequest: req,
    rawResponse: res,
  });
  return res.redirect(authRoute);
});

app.get('/auth/callback', async (req, res) => {
  try {
    const auth = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });
    await pool.query(
      `INSERT INTO installations (shop, access_token, scopes)
       VALUES ($1, $2, $3)
       ON CONFLICT (shop) DO UPDATE SET access_token = EXCLUDED.access_token, scopes = EXCLUDED.scopes`,
      [auth.session.shop, auth.session.accessToken, auth.session.scope]
    );

    const topics = ['PRODUCTS_CREATE', 'PRODUCTS_UPDATE', 'PRODUCTS_DELETE'];
    for (const topic of topics) {
      await shopify.webhooks.register({
        session: auth.session,
        path: '/webhooks',
        webhook: { topic, deliveryMethod: 'HTTP', endpoint: '/webhooks' }
      });
    }

    return res.redirect(`/?shop=${auth.session.shop}`);
  } catch (error) {
    console.error('Auth callback failed', error);
    return res.status(500).send('Authentication failed');
  }
});

app.post('/webhooks', async (req, res) => {
  try {
    await shopify.webhooks.validate({
      rawBody: req.body,
      rawRequest: req,
      rawResponse: res
    });
  } catch (err) {
    console.error('Invalid webhook', err);
    return res.status(401).send('Invalid webhook');
  }

  const topic = req.headers['x-shopify-topic'];
  const shop = req.headers['x-shopify-shop-domain'];
  const body = JSON.parse(req.body.toString());

  const deleted = topic === 'products/delete';
  const productId = body.id;

  await indexQueue.add('index', { shop, productId, deleted });
  res.status(200).send('OK');
});

app.get('/synonyms', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM synonyms ORDER BY id');
  res.json(rows);
});

app.post('/synonyms', async (req, res) => {
  const { term, synonyms } = req.body;
  await pool.query('INSERT INTO synonyms(term, synonyms) VALUES ($1, $2)', [term, synonyms]);
  await refreshSynonyms();
  res.status(201).send('created');
});

app.delete('/synonyms/:id', async (req, res) => {
  await pool.query('DELETE FROM synonyms WHERE id = $1', [req.params.id]);
  await refreshSynonyms();
  res.status(204).end();
});

app.get('/weights', async (_req, res) => {
  const { rows } = await pool.query('SELECT field, weight FROM field_weights');
  res.json(rows);
});

app.post('/weights', async (req, res) => {
  const { field, weight } = req.body;
  await pool.query(
    'INSERT INTO field_weights(field, weight) VALUES ($1, $2) ON CONFLICT (field) DO UPDATE SET weight = EXCLUDED.weight',
    [field, weight]
  );
  res.status(204).end();
});

app.get('/search', async (req, res) => {
  const end = searchHistogram.startTimer();
  const q = req.query.q || '';
  const tags = req.query.tags ? req.query.tags.split(',') : [];
  const minPrice = req.query.min_price ? parseFloat(req.query.min_price) : null;
  const maxPrice = req.query.max_price ? parseFloat(req.query.max_price) : null;

  const cacheKey = `search:${q}:${tags.join(',')}:${minPrice}:${maxPrice}`;
  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const { rows: synRows } = await pool.query('SELECT term, synonyms FROM synonyms');
  const synonyms = Object.fromEntries(synRows.map(r => [r.term, r.synonyms]));

  const tokens = q.split(/\s+/).filter(Boolean);
  const expanded = tokens.flatMap(t => [t, ...(synonyms[t] || [])]);

  const { rows: weightRows } = await pool.query('SELECT field, weight FROM field_weights');
  const fields = weightRows.map(r => `${r.field}^${r.weight}`);

  const must = expanded.map(token => ({
    multi_match: {
      query: token,
      fields,
      fuzziness: 'AUTO'
    }
  }));

  const filter = [];
  if (tags.length) filter.push({ terms: { tags } });
  if (minPrice !== null || maxPrice !== null) {
    const range = {};
    if (minPrice !== null) range.gte = minPrice;
    if (maxPrice !== null) range.lte = maxPrice;
    filter.push({ range: { price: range } });
  }

  const { hits } = await es.search({
    index: 'products',
    query: { bool: { must, filter } }
  });

  await redis.set(cacheKey, JSON.stringify(hits.hits), 'EX', 300);
  end();
  res.json(hits.hits);
});

app.get('/healthz', (_req, res) => res.send('ok'));

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`API listening on ${port}`);
    startIndexer();
  });
}

export default app;
