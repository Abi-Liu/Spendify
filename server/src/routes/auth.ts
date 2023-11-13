import express from "express";
import authController from "../controllers/auth";
import passport from "../config/passport";

const router = express.Router();

router.get("/login/success", authController.getLoginSuccess);
router.get("/login/failed", authController.getLoginFailed);
router.get("/logout", authController.logout);
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL || "http://localhost:5173/",
    failureRedirect: "/login/failed",
  })
);

export default router;
