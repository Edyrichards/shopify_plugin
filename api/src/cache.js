import Redis from 'ioredis';

const redis = process.env.NODE_ENV === 'test'
  ? { get: async () => null, set: async () => {}, duplicate: () => ({}) }
  : new Redis(process.env.REDIS_URL);

export default redis;
