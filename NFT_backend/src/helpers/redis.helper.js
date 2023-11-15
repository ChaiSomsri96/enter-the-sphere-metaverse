const Redis = require('ioredis');
const config = require('../config');
const redis = new Redis(config.redisPort, config.redisHost);

module.exports = redis;
