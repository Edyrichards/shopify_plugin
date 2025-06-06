import dotenv from 'dotenv';
import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

dotenv.config();

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: (process.env.SHOPIFY_SCOPES || 'write_products,read_products').split(','),
  hostName: process.env.SHOPIFY_APP_URL.replace(/^https?:\/\//, ''),
  apiVersion: LATEST_API_VERSION,
});

export default shopify;
