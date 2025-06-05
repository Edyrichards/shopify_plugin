import { Queue, Worker } from 'bullmq';
import redisClient from './cache.js';
import es from './es.js';
import pool from './db.js';
import shopify from './shopify.js';

const connection = redisClient.duplicate();

export const indexQueue = new Queue('product-index', { connection });

export function startIndexer() {
  const worker = new Worker('product-index', async job => {
    const { shop, productId, deleted } = job.data;

    const result = await pool.query('SELECT access_token FROM installations WHERE shop = $1', [shop]);
    if (result.rowCount === 0) return;
    const accessToken = result.rows[0].access_token;

    const rest = new shopify.clients.Rest({ session: { shop, accessToken } });

    if (deleted) {
      await es.delete({ index: 'products', id: String(productId) }, { ignore: [404] });
      return;
    }

    const { body } = await rest.get({ path: `products/${productId}` });
    const product = body.product;
    const doc = {
      title: product.title,
      body_html: product.body_html,
      tags: product.tags,
      updated_at: product.updated_at
    };

    await es.index({ index: 'products', id: String(product.id), document: doc });
  }, { connection });

  worker.on('failed', (job, err) => {
    console.error('Indexing failed for job', job.id, err);
  });
}
