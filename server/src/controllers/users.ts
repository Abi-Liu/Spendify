import { Request, Response } from "express";
import { getUserById } from "../database/users";

export default {
  getUserTransactionCount: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { transactions_count: transactionsCount } = await getUserById(
        Number(userId)
      );
      res.status(200).json(transactionsCount);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  },
};
