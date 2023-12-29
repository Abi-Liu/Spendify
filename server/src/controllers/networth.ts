import { Request, Response } from "express";
import redis from "../config/redis";

export default {
  // use a sliding window approach to keep the past 90 days of net worth data in redis.
  addNetworthData: async (req: Request, res: Response) => {
    const { userId, networth, date } = req.body;
    const key = `networth:${userId}`;
    try {
      // set the entry into the redis hash. the date will be used as the key
      await redis.hset(key, date, networth);
      // if the length is greater than 90, we have to slide the window closed until we are at 90 or below
      const length = await redis.hlen(key);
      if (length > 90) {
        const keys = await redis.hkeys(key);
        // because the oldest date will always be at the first key in the hash, we can just delete the first key
        await redis.hdel(key, keys[0]);
      }
      const data = redis.hgetall(key);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating networth" });
    }
  },

  getNetworthData: async (req: Request, res: Response) => {
    const { userId } = req.params;
    const key = `networth:${userId}`;
    try {
      const data = await redis.hgetall(key);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Could not fetch networth data" });
    }
  },
};
