import express from "express";
import transactionsController from "../controllers/transactions";
import isAuthenticated from "../middlewares/isAuthenticated";

const router = express.Router();

router.get(
  "/user/:id",
  isAuthenticated,
  transactionsController.getTransactionsByUser
);
router.get(
  "/pagination",
  isAuthenticated,
  transactionsController.getTransactionsPagination
);
router.get(
  "/items/:id",
  isAuthenticated,
  transactionsController.getTransactionsByItem
);

export default router;
