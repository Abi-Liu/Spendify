import { Request, Response } from "express";
import { createBudget, getBudgetByUser } from "../database/budgets";

export default {
  createBudget: async (req: Request, res: Response) => {
    const { budgetAmount, userId } = req.body;

    try {
      // create the budget
      await createBudget(budgetAmount, userId);

      // then we retrieve it with additional information from the get sql query
      const date = new Date().toISOString().split("T")[0];
      const data = await getBudgetByUser(userId, date);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating budget" });
    }
  },

  getBudget: async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      // hard code the date for now, maybe in the future i can implement past months budgets
      const date = new Date().toISOString().split("T")[0];
      const budget = await getBudgetByUser(Number(userId), date);
      res.status(200).json(budget);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error when fetching budget" });
    }
  },
};
