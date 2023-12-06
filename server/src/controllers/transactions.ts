import { Request, Response } from "express";
import { getUserTransactionsFromDates } from "../database/transactions";
import { sanitizeTransactions } from "../utils/sanitize";
export default {
  getTransactionsByUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query as {
        startDate: string;
        endDate: string;
      };
      let transactions;
      if (startDate && endDate) {
        transactions = await getUserTransactionsFromDates(
          startDate,
          endDate,
          Number(id)
        );
      }
      if (transactions) {
        res.status(200).json(sanitizeTransactions(transactions));
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching transactions" });
    }
  },
};
