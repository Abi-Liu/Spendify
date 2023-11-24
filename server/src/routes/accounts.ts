import express from "express";
import accountsController from "../controllers/accounts";
const router = express.Router();

router.get("/items/:itemId", accountsController.getAccountsByItemId);
router.get("/user/:userId", accountsController.getAccountsByUserId);
router.delete("/items/:itemId", accountsController.deleteAccountsByItemId);

export default router;
