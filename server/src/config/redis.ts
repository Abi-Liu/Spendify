import Redis from "ioredis";

const { REDIS_HOST, REDIS_PORT } = process.env;

const host = REDIS_HOST!;
const port = parseInt(REDIS_PORT!);

// Create a Redis client
const redis = new Redis({
  host: host,
  port: port,
});

export default redis;
