"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accounts_1 = __importDefault(require("../controllers/accounts"));
const isAuthenticated_1 = __importDefault(require("../middlewares/isAuthenticated"));
const router = express_1.default.Router();
router.get("/items/:itemId", isAuthenticated_1.default, accounts_1.default.getAccountsByItemId);
router.get("/user/:userId", isAuthenticated_1.default, accounts_1.default.getAccountsByUserId);
router.delete("/items/:itemId", isAuthenticated_1.default, accounts_1.default.deleteAccountsByItemId);
exports.default = router;
//# sourceMappingURL=accounts.js.map