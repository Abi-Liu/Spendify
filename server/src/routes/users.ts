import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import usersController from "../controllers/users";

const router = express.Router();

router.get(
  "/:userId",
  isAuthenticated,
  usersController.getUserTransactionCount
);

export default router;
