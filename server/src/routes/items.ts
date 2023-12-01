import express from "express";
import itemsController from "../controllers/items";
const router = express.Router();

router.get("/:itemId", itemsController.getItemsByItemId);
router.get("/user/:userId", itemsController.getItemsByUser);
router.delete("/:itemId", itemsController.deleteItemByItemId);

export default router;
