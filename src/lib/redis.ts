import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;

// If REDIS_URL is provided, connect to Redis. Otherwise, fail silently (graceful degradation).
let redis: Redis | null = null;

if (REDIS_URL) {
  try {
    redis = new Redis(REDIS_URL);
    console.log('✅ Connected to Redis Cache');
  } catch (error) {
    console.error('❌ Redis Connection Error:', error);
  }
}

export default redis;
