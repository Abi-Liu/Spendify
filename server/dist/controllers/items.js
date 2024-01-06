"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const items_1 = require("../database/items");
const sanitize_1 = require("../utils/sanitize");
exports.default = {
    getItemsByItemId: async (req, res) => {
        try {
            const { itemId } = req.params;
            const item = await (0, items_1.getItemById)(itemId);
            res.status(200).json((0, sanitize_1.sanitizeItems)(item));
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching items" });
        }
    },
    getItemsByUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const items = await (0, items_1.getItemsByUserId)(userId);
            const sanitized = (0, sanitize_1.sanitizeItems)(items);
            res.status(200).json(sanitized);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching items" });
        }
    },
    deleteItemByItemId: async (req, res) => {
        try {
            const { itemId } = req.params;
            await (0, items_1.deleteItemByItemId)(itemId);
            console.log("deleted");
            res.status(200).json({ message: "deleted" });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching items" });
        }
    },
    updateItemStatus: async (req, res) => {
        try {
            const { status, itemId } = req.body;
            console.log(status, itemId);
            const data = await (0, items_1.setItemStatus)(itemId, status);
            console.log(data);
            res.status(200);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating item status" });
        }
    },
};
//# sourceMappingURL=items.js.map