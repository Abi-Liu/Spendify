import express from "express";
import budgetsController from "../controllers/budgets";
import isAuthenticated from "../middlewares/isAuthenticated";

const router = express.Router();

router.post("/", isAuthenticated, budgetsController.createBudget);
router.get("/:userId", isAuthenticated, budgetsController.getBudget);

export default router;
