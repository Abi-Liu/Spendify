import { Request, Response } from "express";
import { getAccountsByItemId } from "../database/accounts";
import { sanitizeAccounts } from "src/utils/sanitize";

export default {
  getAccountsByItemId: async (req: Request, res: Response) => {
    try {
      const { itemId } = req.params;
      const accounts = await getAccountsByItemId(itemId);
      res.status(200).json(sanitizeAccounts(accounts));
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error when fetching accounts" });
    }
  },

  getAccountsByUserId: async (req: Request, res: Response) => {
    try {
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error when fetching accounts" });
    }
  },
};
