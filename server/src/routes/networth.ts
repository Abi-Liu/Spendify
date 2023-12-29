import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import networthController from "../controllers/networth";

const router = express.Router();

router.get("/:userId", isAuthenticated);
router.post("/:userId", isAuthenticated, networthController.addNetworthData);

export default router;
