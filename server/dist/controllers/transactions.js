"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactions_1 = require("../database/transactions");
const sanitize_1 = require("../utils/sanitize");
exports.default = {
    getTransactionsByUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { startDate, endDate } = req.query;
            let transactions;
            if (startDate && endDate) {
                transactions = await (0, transactions_1.getUserTransactionsFromDates)(startDate, endDate, Number(id));
            }
            if (transactions) {
                res.status(200).json((0, sanitize_1.sanitizeTransactions)(transactions));
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching transactions" });
        }
    },
    getTransactionsPagination: async (req, res) => {
        try {
            const { column, columnValue, offset, limit } = req.query;
            // gets the next page of transactions
            const transactions = await (0, transactions_1.getPaginatedTransactions)(column, columnValue, Number(offset), Number(limit));
            res.status(200).json((0, sanitize_1.sanitizeTransactions)(transactions));
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching transactions" });
        }
    },
    getTransactionsByItem: async (req, res) => {
        try {
            const { id } = req.params;
            const { startDate, endDate } = req.query;
            let transactions;
            if (startDate && endDate) {
                transactions = await (0, transactions_1.getItemTransactionsFromDates)(startDate, endDate, Number(id));
            }
            if (transactions) {
                res.status(200).json((0, sanitize_1.sanitizeTransactions)(transactions));
            }
        }
        catch (error) {
            console.error("Error getting transactions by item", error);
            res.status(500).json({ message: "Error getting transactions by item" });
        }
    },
};
//# sourceMappingURL=transactions.js.map