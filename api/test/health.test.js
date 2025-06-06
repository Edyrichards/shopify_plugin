import { jest } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('../src/db.js', () => ({ default: { query: jest.fn() } }));
jest.unstable_mockModule('../src/cache.js', () => ({ default: { get: jest.fn(), set: jest.fn(), duplicate: () => ({}) } }));
jest.unstable_mockModule('../src/es.js', () => ({ default: { search: jest.fn(), indices: { create: jest.fn(), close: jest.fn(), put_settings: jest.fn(), open: jest.fn() } }, refreshSynonyms: jest.fn() }));
jest.unstable_mockModule('../src/indexer.js', () => ({ indexQueue: { add: jest.fn() }, startIndexer: jest.fn() }));
jest.unstable_mockModule('../src/shopify.js', () => ({ default: {} }));

const { default: app } = await import('../src/server.js');

test('GET /healthz returns ok', async () => {
  const res = await request(app).get('/healthz');
  expect(res.statusCode).toBe(200);
  expect(res.text).toBe('ok');
});
