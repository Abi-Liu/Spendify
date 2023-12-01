import { Request, Response } from "express";
import {
  deleteAccountsByItemId,
  getAccountsByItemId,
  getAccountsByUserId,
} from "../database/accounts";
import { sanitizeAccounts } from "../utils/sanitize";

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
      const { userId } = req.params;
      const accounts = await getAccountsByUserId(userId);
      res.status(200).json(sanitizeAccounts(accounts));
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error when fetching accounts" });
    }
  },

  deleteAccountsByItemId: async (req: Request, res: Response) => {
    try {
      const { itemId } = req.params;
      await deleteAccountsByItemId(itemId);
      console.log("deleted");
      res.status(200).json({ message: "deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error when deleting accounts" });
    }
  },
};
