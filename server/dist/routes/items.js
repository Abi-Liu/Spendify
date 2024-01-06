"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const items_1 = __importDefault(require("../controllers/items"));
const isAuthenticated_1 = __importDefault(require("../middlewares/isAuthenticated"));
const router = express_1.default.Router();
router.get("/:itemId", isAuthenticated_1.default, items_1.default.getItemsByItemId);
router.get("/user/:userId", isAuthenticated_1.default, items_1.default.getItemsByUser);
router.delete("/:itemId", isAuthenticated_1.default, items_1.default.deleteItemByItemId);
router.put("/", isAuthenticated_1.default, items_1.default.updateItemStatus);
exports.default = router;
//# sourceMappingURL=items.js.map