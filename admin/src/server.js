import express from 'express';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const apiUrl = process.env.API_URL || 'http://localhost:3000';
app.use(['/synonyms', '/weights', '/analytics', '/search'], createProxyMiddleware({ target: apiUrl, changeOrigin: true }));

app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('*', (_req, res) => {
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace('__API_KEY__', process.env.SHOPIFY_API_KEY || '');
  res.send(html);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Admin listening on ${port}`);
});
