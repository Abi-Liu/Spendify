import express from "express";

const router = express.Router();

// fetches all transactions for a single account.

// how would i implement redis cache for this and items/transactions route? Because the rdis cache only holds the last years worth of transactions, should i have a general route to hit the cache, and have another route if the user wants transaction details outside of the redis cache? I.E transactions for the past 2 years.

export default router;
