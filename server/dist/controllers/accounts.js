"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accounts_1 = require("../database/accounts");
const sanitize_1 = require("../utils/sanitize");
exports.default = {
    getAccountsByItemId: async (req, res) => {
        try {
            const { itemId } = req.params;
            const accounts = await (0, accounts_1.getAccountsByItemId)(itemId);
            res.status(200).json((0, sanitize_1.sanitizeAccounts)(accounts));
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error when fetching accounts" });
        }
    },
    getAccountsByUserId: async (req, res) => {
        try {
            const { userId } = req.params;
            const accounts = await (0, accounts_1.getAccountsByUserId)(userId);
            res.status(200).json((0, sanitize_1.sanitizeAccounts)(accounts));
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error when fetching accounts" });
        }
    },
    deleteAccountsByItemId: async (req, res) => {
        try {
            const { itemId } = req.params;
            await (0, accounts_1.deleteAccountsByItemId)(itemId);
            console.log("deleted");
            res.status(200).json({ message: "deleted" });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error when deleting accounts" });
        }
    },
};
//# sourceMappingURL=accounts.js.map