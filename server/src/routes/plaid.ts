import express from "express";
import plaidController from "../controllers/plaid";

const router = express.Router();

router.post("/createLinkToken", plaidController.createLinkToken);
router.post("/setAccessToken", plaidController.setAccessToken);

export default router;
