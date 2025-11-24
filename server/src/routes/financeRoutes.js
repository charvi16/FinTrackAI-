import express from "express";
import { getEmergencyFund } from "../controllers/financeController.js";

const router = express.Router();

router.post("/emergency-fund", getEmergencyFund);

export default router;
