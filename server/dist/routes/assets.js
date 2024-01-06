"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = __importDefault(require("../middlewares/isAuthenticated"));
const assets_1 = __importDefault(require("../controllers/assets"));
const router = express_1.default.Router();
router.get("/:userId", isAuthenticated_1.default, assets_1.default.getAssetsByUserId);
router.post("/", isAuthenticated_1.default, assets_1.default.createAsset);
router.delete("/:id", isAuthenticated_1.default, assets_1.default.deleteAsset);
exports.default = router;
//# sourceMappingURL=assets.js.map