import { jest } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('../src/db.js', () => ({ default: { query: jest.fn() } }));
jest.unstable_mockModule('../src/cache.js', () => ({ default: { get: jest.fn(), set: jest.fn(), duplicate: () => ({}) } }));
jest.unstable_mockModule('../src/es.js', () => ({ default: {}, refreshSynonyms: jest.fn() }));
jest.unstable_mockModule('../src/indexer.js', () => ({ indexQueue: { add: jest.fn() }, startIndexer: jest.fn() }));
jest.unstable_mockModule('../src/shopify.js', () => ({ default: {} }));

const { default: app } = await import('../src/server.js');

const db = (await import('../src/db.js')).default;
const { refreshSynonyms } = await import('../src/es.js');

test('POST /synonyms inserts row and refreshes', async () => {
  db.query.mockResolvedValue({});
  const res = await request(app)
    .post('/synonyms')
    .send({ term: 'cat', synonyms: ['feline'] });
  expect(res.statusCode).toBe(201);
  expect(db.query).toHaveBeenCalled();
  expect(refreshSynonyms).toHaveBeenCalled();
});

