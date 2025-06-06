import { jest } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('../src/db.js', () => ({ default: { query: jest.fn() } }));
jest.unstable_mockModule('../src/cache.js', () => ({ default: { get: jest.fn(), set: jest.fn(), duplicate: () => ({}) } }));
jest.unstable_mockModule('../src/es.js', () => ({ default: {}, refreshSynonyms: jest.fn() }));
jest.unstable_mockModule('../src/indexer.js', () => ({ indexQueue: { add: jest.fn() }, startIndexer: jest.fn() }));
jest.unstable_mockModule('../src/shopify.js', () => ({ default: {} }));

const { default: app } = await import('../src/server.js');

const db = (await import('../src/db.js')).default;

test('POST /weights upserts field weight', async () => {
  db.query.mockResolvedValue({});
  const res = await request(app)
    .post('/weights')
    .send({ field: 'title', weight: 2 });
  expect(res.statusCode).toBe(204);
  expect(db.query).toHaveBeenCalled();
});
