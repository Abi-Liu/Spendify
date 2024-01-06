"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = __importDefault(require("../middlewares/isAuthenticated"));
const networth_1 = __importDefault(require("../controllers/networth"));
const router = express_1.default.Router();
router.get("/:userId", isAuthenticated_1.default);
router.post("/", isAuthenticated_1.default, networth_1.default.addNetworthData);
exports.default = router;
//# sourceMappingURL=networth.js.map