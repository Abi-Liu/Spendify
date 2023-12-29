import { Request, Response } from "express";
import redis from "../config/redis";

export default {
  // use a sliding window approach to keep the past 90 days of net worth data in redis.
  addNetworthData: async (req: Request, res: Response) => {
    const { userId, networth, date } = req.body;
    // limit window to 90 days
    const MAX_WINDOW_SIZE = 90;
    const key = `networth:${userId}`;
    const value = { date, networth };
    try {
      await redis.lpush(key, JSON.stringify(value));

      // if list length is greater than 90, trim off the excess
      // this will remove the oldest networth value if the length exceeds 90
      await redis.ltrim(key, 0, MAX_WINDOW_SIZE - 1);
      const data = await redis.lrange(key, 0, -1);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating networth" });
    }
  },
};
