import express from 'express';
import dotenv from 'dotenv';
import shopify from './shopify.js';
import pool from './db.js';
import redis from './cache.js';
import es from './es.js';
import { indexQueue, startIndexer } from './indexer.js';

dotenv.config();

const app = express();
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

app.get('/search', async (req, res) => {
  const q = req.query.q || '';
  const cacheKey = `search:${q}`;
  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const { hits } = await es.search({
    index: 'products',
    query: { multi_match: { query: q, fields: ['title', 'body_html', 'tags'] } }
  });

  await redis.set(cacheKey, JSON.stringify(hits.hits), 'EX', 300);
  res.json(hits.hits);
});

app.get('/healthz', (_req, res) => res.send('ok'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API listening on ${port}`);
  startIndexer();
});
