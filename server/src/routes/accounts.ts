import express from "express";
import accountsController from "../controllers/accounts";
import isAuthenticated from "../middlewares/isAuthenticated";
const router = express.Router();

router.get(
  "/items/:itemId",
  isAuthenticated,
  accountsController.getAccountsByItemId
);
router.get(
  "/user/:userId",
  isAuthenticated,
  accountsController.getAccountsByUserId
);
router.delete(
  "/items/:itemId",
  isAuthenticated,
  accountsController.deleteAccountsByItemId
);

export default router;
