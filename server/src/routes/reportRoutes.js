import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generateMonthlyPDF } from "../controllers/reportController.js";

const router = express.Router();

router.get("/pdf", protect, generateMonthlyPDF);

export default router;
