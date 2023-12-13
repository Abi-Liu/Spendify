import express from "express";
import institutionsController from "../controllers/institutions";
import isAuthenticated from "../middlewares/isAuthenticated";

const router = express.Router();

router.get("/:id", isAuthenticated, institutionsController.getInstitutionById);

export default router;
