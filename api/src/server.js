import express from 'express';
import dotenv from 'dotenv';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

dotenv.config();

const app = express();
app.use(express.json());

export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: (process.env.SHOPIFY_SCOPES || 'write_products,read_products').split(','),
  hostName: process.env.SHOPIFY_APP_URL.replace(/^https?:\/\//, ''),
  apiVersion: LATEST_API_VERSION,
});

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
    await shopify.auth.installSubscription({
      shop: auth.session.shop,
      accessToken: auth.session.accessToken,
    });
    return res.redirect(`/?shop=${auth.session.shop}`);
  } catch (error) {
    console.error('Auth callback failed', error);
    return res.status(500).send('Authentication failed');
  }
});

// Webhook handler example
app.post(
  '/webhooks',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      await shopify.webhooks.process({
        rawBody: req.body,
        rawRequest: req,
        rawResponse: res,
      });
    } catch (error) {
      console.error('Failed to process webhook', error);
      return res.status(500).send('Webhook processing failed');
    }
    res.status(200).send('OK');
  }
);

app.get('/healthz', (_req, res) => res.send('ok'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API listening on ${port}`);
});
