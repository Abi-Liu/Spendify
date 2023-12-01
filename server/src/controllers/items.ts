import { Request, Response } from "express";
import {
  deleteItemByItemId,
  getItemById,
  getItemsByUserId,
} from "../database/items";
import { sanitizeItems } from "../utils/sanitize";

export default {
  getItemsByItemId: async (req: Request, res: Response) => {
    try {
      const { itemId } = req.params;
      const item = await getItemById(itemId);
      res.status(200).json(sanitizeItems(item));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching items" });
    }
  },

  getItemsByUser: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const items = await getItemsByUserId(userId);
      const sanitized = sanitizeItems(items);
      console.log(sanitized);
      res.status(200).json(sanitized);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching items" });
    }
  },

  deleteItemByItemId: async (req: Request, res: Response) => {
    try {
      const { itemId } = req.params;
      await deleteItemByItemId(itemId);
      console.log("deleted");
      res.status(200).json({ message: "deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching items" });
    }
  },
};
