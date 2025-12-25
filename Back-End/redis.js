const { Cluster, Redis } = require('ioredis');

let redis;
const cacheRedisUrl = process.env.REDIS_CACHE_URL;

if (cacheRedisUrl) {
  redis = new Redis(cacheRedisUrl);
  console.log('Cache: Using dedicated cache Redis URL: ',cacheRedisUrl);
} else {
 
  redis = new Redis('redis://localhost:6380');
  console.log('Cache: Using development Redis (port 6380)');
}

redis.on('error', (err) => {
  console.error('Redis Cache Client Error', err);
});
module.exports = redis;