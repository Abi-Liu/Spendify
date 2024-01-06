"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const institutions_1 = __importDefault(require("../controllers/institutions"));
const isAuthenticated_1 = __importDefault(require("../middlewares/isAuthenticated"));
const router = express_1.default.Router();
router.get("/:id", isAuthenticated_1.default, institutions_1.default.getInstitutionById);
exports.default = router;
//# sourceMappingURL=institutions.js.map