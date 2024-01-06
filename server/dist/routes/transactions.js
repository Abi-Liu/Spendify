"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactions_1 = __importDefault(require("../controllers/transactions"));
const isAuthenticated_1 = __importDefault(require("../middlewares/isAuthenticated"));
const router = express_1.default.Router();
router.get("/user/:id", isAuthenticated_1.default, transactions_1.default.getTransactionsByUser);
router.get("/pagination", isAuthenticated_1.default, transactions_1.default.getTransactionsPagination);
router.get("/items/:id", isAuthenticated_1.default, transactions_1.default.getTransactionsByItem);
exports.default = router;
//# sourceMappingURL=transactions.js.map