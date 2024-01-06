"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const budgets_1 = __importDefault(require("../controllers/budgets"));
const isAuthenticated_1 = __importDefault(require("../middlewares/isAuthenticated"));
const router = express_1.default.Router();
router.post("/", isAuthenticated_1.default, budgets_1.default.createBudget);
router.get("/:userId", isAuthenticated_1.default, budgets_1.default.getBudget);
exports.default = router;
//# sourceMappingURL=budgets.js.map