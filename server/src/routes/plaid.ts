import express from "express";
import plaidController from "../controllers/plaid";
import isAuthenticated from "../middlewares/isAuthenticated";

const router = express.Router();

router.post(
  "/createLinkToken",
  isAuthenticated,
  plaidController.createLinkToken
);
router.post("/setAccessToken", isAuthenticated, plaidController.setAccessToken);

export default router;
