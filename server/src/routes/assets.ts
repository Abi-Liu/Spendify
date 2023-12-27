import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import assetsController from "../controllers/assets";

const router = express.Router();

router.get("/:userId", isAuthenticated, assetsController.getAssetsByUserId);
router.post("/", isAuthenticated, assetsController.createAsset);
router.delete("/:id", isAuthenticated, assetsController.deleteAsset);

export default router;
