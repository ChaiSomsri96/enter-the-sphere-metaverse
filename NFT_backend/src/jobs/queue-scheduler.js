const { QueueScheduler } = require('bullmq');

const Redis = require('ioredis');

const config = require('../config');

const redis = new Redis(config.redisPort, config.redisHost);

const queueScheduler = new QueueScheduler('sphere-scheduler',{
	connection: redis,
});

module.exports=queueScheduler;


