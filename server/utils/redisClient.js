const redis = require('redis');

const redisClient = redis.createClient({
    url: 'redis://redis:6379',
    legacyMode: true,
});

module.exports = redisClient;