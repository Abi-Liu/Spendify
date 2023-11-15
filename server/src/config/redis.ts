import Redis from "ioredis";

const host = process.env.REDIS_HOST!;
const port = parseInt(process.env.REDIS_PORT!);
const password = process.env.REDIS_PASSWORD!;

// Create a Redis client
export const redis = new Redis({
  host: host,
  port: port,
  password: password,
});
