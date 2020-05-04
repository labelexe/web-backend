"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const IORedis = require("ioredis");
let redis;
if (process.env.NODE_ENV !== 'test') {
    const ioRedisConfig = {
        password: config_1.default.redis.pass || '',
        host: config_1.default.redis.host,
        connectTimeout: 10000,
        port: config_1.default.redis.port || 6379,
        enableOfflineQueue: true,
        sentinelPassword: config_1.default.redis.pass || '',
    };
    redis = new IORedis(ioRedisConfig);
    redis.on('error', (ev) => {
        console.log('IORedis Error:');
        console.log(ev);
        redis = new IORedis(ioRedisConfig);
    });
    console.log('REDIS was setup!');
}
exports.default = redis;

