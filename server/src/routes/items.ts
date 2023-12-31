import express from "express";
import itemsController from "../controllers/items";
import isAuthenticated from "../middlewares/isAuthenticated";
const router = express.Router();

router.get("/:itemId", isAuthenticated, itemsController.getItemsByItemId);
router.get("/user/:userId", isAuthenticated, itemsController.getItemsByUser);
router.delete("/:itemId", isAuthenticated, itemsController.deleteItemByItemId);
router.put("/", isAuthenticated, itemsController.updateItemStatus);

export default router;
