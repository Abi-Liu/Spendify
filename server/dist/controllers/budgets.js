"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const budgets_1 = require("../database/budgets");
exports.default = {
    createBudget: async (req, res) => {
        const { budgetAmount, userId } = req.body;
        try {
            // create the budget
            await (0, budgets_1.createBudget)(budgetAmount, userId);
            // then we retrieve it with additional information from the get sql query
            const date = new Date().toISOString().split("T")[0];
            const data = await (0, budgets_1.getBudgetByUser)(userId, date);
            res.status(200).json(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error creating budget" });
        }
    },
    getBudget: async (req, res) => {
        const { userId } = req.params;
        try {
            // hard code the date for now, maybe in the future i can implement past months budgets
            const date = new Date().toISOString().split("T")[0];
            const budget = await (0, budgets_1.getBudgetByUser)(Number(userId), date);
            res.status(200).json(budget);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error when fetching budget" });
        }
    },
};
//# sourceMappingURL=budgets.js.map