import express from "express";
import institutionsController from "../controllers/institutions";

const router = express.Router();

router.get("/:id", institutionsController.getInstitutionById);

export default router;
