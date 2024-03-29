import { Request, Response } from "express";
import {
  getItemTransactionsFromDates,
  getPaginatedTransactions,
  getTransactionsCount,
  getUserTransactionsFromDates,
} from "../database/transactions";
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

  getTransactionsPagination: async (req: Request, res: Response) => {
    try {
      const { column, columnValue, offset, limit } = req.query;
      if (column && columnValue && offset && limit) {
        // gets the next page of transactions
        const transactions = await getPaginatedTransactions(
          column as string,
          columnValue as string,
          Number(offset),
          Number(limit)
        );

        const count = await getTransactionsCount(
          column as string,
          columnValue as string
        );

        let nextPage;
        if (Number(offset) + Number(limit) < count) {
          nextPage = true;
        } else {
          nextPage = false;
        }

        res
          .status(200)
          .json({ transactions: sanitizeTransactions(transactions), nextPage });
      } else {
        res.status(500).json({ message: "Invalid query paramters" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching transactions" });
    }
  },

  getTransactionsByItem: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query as {
        startDate: string;
        endDate: string;
      };

      let transactions;
      if (startDate && endDate) {
        transactions = await getItemTransactionsFromDates(
          startDate,
          endDate,
          Number(id)
        );
      }
      if (transactions) {
        res.status(200).json(sanitizeTransactions(transactions));
      }
    } catch (error) {
      console.error("Error getting transactions by item", error);
      res.status(500).json({ message: "Error getting transactions by item" });
    }
  },
};
