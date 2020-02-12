"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../helpers/config");
const options = {
    host: config_1.default.redis.host,
    pass: '',
    db: 1,
};
if (config_1.default.redis.pass) {
    options.pass = config_1.default.redis.pass;
}
const redis = require("redis");
const session = require("express-session");
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient(options);
redisClient.unref();
redisClient.on('error', console.log);
let store = new RedisStore({ client: redisClient });
exports.parser = session({
    name: 'rbxsession',
    secret: config_1.default.session.secret,
    resave: false,
    store: store,
    saveUninitialized: true,
    cookie: {
        secure: config_1.default.session.secure,
        maxAge: 86400 * 1000 * 30 * 12,
        sameSite: 'lax',
    },
});
exports.default = exports.parser;

