import express from "express";
import itemsController from "../controllers/items";
const router = express.Router();

router.get("/items/:itemId", itemsController.getItemsByItemId);
router.get("/items/user/:userId", itemsController.getItemsByUser);
router.delete("/items/:itemId", itemsController.deleteItemByItemId);

export default router;
