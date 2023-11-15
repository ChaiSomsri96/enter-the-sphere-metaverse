const Redis = require("ioredis");
const config = require('./config');

const redis = new Redis(6379, config.redisHost);

module.exports = redis;
