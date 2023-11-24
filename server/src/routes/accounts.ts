import express from "express";

const router = express.Router();

router.get("/items/:itemId", () => {});
router.get("/user/:userId", () => {});
router.delete("/items/:itemId", () => {});

export default router;
