import express from "express";
import authController from "../controllers/auth";
import passport from "../config/passport";

const router = express.Router();
const { CLIENT_URL } = process.env;

router.get("/login/success", authController.getLoginSuccess);
router.get("/login/failed", authController.getLoginFailed);
router.get("/logout", authController.logout);
router.delete("/deleteUser/:id", authController.deleteUser);
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

export default router;
