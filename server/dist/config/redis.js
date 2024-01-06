"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const { REDIS_HOST, REDIS_PORT } = process.env;
const host = REDIS_HOST;
const port = parseInt(REDIS_PORT);
// Create a Redis client
const redis = new ioredis_1.default({
    host: host,
    port: port,
});
exports.default = redis;
//# sourceMappingURL=redis.js.map