"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("../config/redis"));
exports.default = {
    // use a sliding window approach to keep the past 90 days of net worth data in redis.
    addNetworthData: async (req, res) => {
        const { userId, networth, date } = req.body;
        const key = `networth:${userId}`;
        try {
            // set the entry into the redis hash. the date will be used as the key
            await redis_1.default.hset(key, date, networth);
            // if the length is greater than 90, we have to slide the window closed until we are at 90 or below
            const length = await redis_1.default.hlen(key);
            if (length > 90) {
                const keys = await redis_1.default.hkeys(key);
                // because the oldest date will always be at the first key in the hash, we can just delete the first key
                await redis_1.default.hdel(key, keys[0]);
            }
            const data = await redis_1.default.hgetall(key);
            res.status(200).json(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating networth" });
        }
    },
    getNetworthData: async (req, res) => {
        const { userId } = req.params;
        const key = `networth:${userId}`;
        try {
            const data = await redis_1.default.hgetall(key);
            res.status(200).json(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Could not fetch networth data" });
        }
    },
};
//# sourceMappingURL=networth.js.map