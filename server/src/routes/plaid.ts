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

// ONLY FOR TESTING PURPOSES ONLY IN SANDBOX MODE
router.post("/test-reset-item", plaidController.testResetLogin);

export default router;
