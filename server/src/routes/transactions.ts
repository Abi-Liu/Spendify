import express from "express";
import transactionsController from "../controllers/transactions";

const router = express.Router();

router.get("/user/:id", transactionsController.getTransactionsByUser);
router.get("/pagination", transactionsController.getTransactionsPagination);

export default router;
