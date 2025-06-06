import { jest } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('../src/db.js', () => ({ default: { query: jest.fn() } }));
jest.unstable_mockModule('../src/cache.js', () => ({ default: { get: jest.fn(), set: jest.fn(), duplicate: () => ({}) } }));
jest.unstable_mockModule('../src/es.js', () => ({ default: { search: jest.fn().mockResolvedValue({ hits: { hits: [] } }) }, refreshSynonyms: jest.fn() }));
jest.unstable_mockModule('../src/indexer.js', () => ({ indexQueue: { add: jest.fn() }, startIndexer: jest.fn() }));
jest.unstable_mockModule('../src/shopify.js', () => ({ default: {} }));

const { default: app } = await import('../src/server.js');

const db = (await import('../src/db.js')).default;
const es = (await import('../src/es.js')).default;
const cache = (await import('../src/cache.js')).default;

test('GET /search queries Elasticsearch and caches result', async () => {
  cache.get.mockResolvedValue(null);
  db.query.mockResolvedValueOnce({ rows: [] }) // synonyms
    .mockResolvedValueOnce({ rows: [] }); // weights
  const res = await request(app).get('/search?q=hat');
  expect(res.statusCode).toBe(200);
  expect(es.search).toHaveBeenCalled();
  expect(cache.set).toHaveBeenCalled();
});
