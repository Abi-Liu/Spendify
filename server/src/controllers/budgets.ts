import { Request, Response } from "express";
import { createBudget } from "../database/budgets";

export default {
  createBudget: async (req: Request, res: Response) => {
    const { budgetAmount, userId } = req.body;
    try {
      const data = await createBudget(budgetAmount, userId);
      console.log(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating budget" });
    }
  },
};
