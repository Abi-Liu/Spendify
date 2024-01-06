"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../controllers/auth"));
const passport_1 = __importDefault(require("../config/passport"));
const router = express_1.default.Router();
const { CLIENT_URL } = process.env;
router.get("/login/success", auth_1.default.getLoginSuccess);
router.get("/login/failed", auth_1.default.getLoginFailed);
router.get("/logout", auth_1.default.logout);
router.delete("/deleteUser/:id", auth_1.default.deleteUser);
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", {
    successRedirect: `${CLIENT_URL}dashboard`,
    failureRedirect: "/login/failed",
}));
exports.default = router;
//# sourceMappingURL=auth.js.map