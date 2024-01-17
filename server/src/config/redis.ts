import Redis, { RedisOptions } from "ioredis";

const { REDIS_HOST, REDIS_PORT } = process.env;

const host = REDIS_HOST!;
const port = parseInt(REDIS_PORT!);

const options: RedisOptions = {
  host: host,
  port: port,
};

// Create a Redis client
const redis = new Redis(options);

export default redis;
