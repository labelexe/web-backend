"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const ioRedis = require("ioredis");
const redis = new ioRedis(config_1.default.redis);
exports.default = redis;

