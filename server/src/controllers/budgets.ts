import { Request, Response } from "express";
import { createBudget, getBudgetByUser } from "../database/budgets";

export default {
  createBudget: async (req: Request, res: Response) => {
    const { budgetAmount, userId } = req.body;
    console.log(budgetAmount, userId);
    try {
      const data = await createBudget(budgetAmount, userId);
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating budget" });
    }
  },

  getBudget: async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const budget = await getBudgetByUser(Number(userId));
      res.status(200).json(budget);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error when fetching budget" });
    }
  },
};
