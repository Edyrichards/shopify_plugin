import { jest } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('../src/db.js', () => ({ default: { query: jest.fn() } }));
jest.unstable_mockModule('../src/cache.js', () => ({ default: { get: jest.fn(), set: jest.fn(), duplicate: () => ({}) } }));
jest.unstable_mockModule('../src/es.js', () => ({ default: { search: jest.fn(), indices: { create: jest.fn(), close: jest.fn(), put_settings: jest.fn(), open: jest.fn() } }, refreshSynonyms: jest.fn() }));
jest.unstable_mockModule('../src/indexer.js', () => ({ indexQueue: { add: jest.fn() }, startIndexer: jest.fn() }));
jest.unstable_mockModule('../src/shopify.js', () => ({ default: {} }));

const { default: app } = await import('../src/server.js');

test('GET /metrics exposes Prometheus metrics', async () => {
  const res = await request(app).get('/metrics');
  expect(res.statusCode).toBe(200);
  expect(res.text).toContain('process_cpu_user_seconds_total');
});
