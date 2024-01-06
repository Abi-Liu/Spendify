"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webhook_1 = __importDefault(require("../controllers/webhook"));
const router = express_1.default.Router();
router.post("/", webhook_1.default.handleWebhook);
// ONLY USED DURING DEVELOPMENT MODE IN SANDBOX
router.post("/fireTestWebhook", webhook_1.default.fireTestWebhook);
exports.default = router;
//# sourceMappingURL=webhook.js.map