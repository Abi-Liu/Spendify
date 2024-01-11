import Redis, { RedisOptions } from "ioredis";

const { REDIS_HOST, REDIS_PORT, ENV } = process.env;

const host = REDIS_HOST!;
const port = parseInt(REDIS_PORT!);
const pw = ENV === "prod" ? process.env.REDIS_PASSWORD! : undefined;

const options: RedisOptions = {
  host: host,
  port: port,
  password: pw,
};

// Create a Redis client
const redis = new Redis(options);

export default redis;
