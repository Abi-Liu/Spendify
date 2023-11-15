import express from "express";
import webhookController from "../controllers/webhook";

const router = express.Router();

router.post("/", webhookController.handleWebhook);

// ONLY USED DURING DEVELOPMENT MODE IN SANDBOX
router.post("/fireTestWebhook", webhookController.fireTestWebhook);

export default router;
