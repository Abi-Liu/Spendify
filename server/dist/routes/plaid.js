"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const plaid_1 = __importDefault(require("../controllers/plaid"));
const isAuthenticated_1 = __importDefault(require("../middlewares/isAuthenticated"));
const router = express_1.default.Router();
router.post("/createLinkToken", isAuthenticated_1.default, plaid_1.default.createLinkToken);
router.post("/setAccessToken", isAuthenticated_1.default, plaid_1.default.setAccessToken);
// ONLY FOR TESTING PURPOSES ONLY IN SANDBOX MODE
router.post("/test-reset-item", plaid_1.default.testResetLogin);
exports.default = router;
//# sourceMappingURL=plaid.js.map