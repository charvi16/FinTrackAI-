// server/src/routes/dashboardRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getCategoryStats,
  getMonthlyStats,
  getRecurring,
  getAiSnapshot,
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats/categories', protect, getCategoryStats);
router.get('/stats/monthly', protect, getMonthlyStats);
router.get('/recurring', protect, getRecurring);
router.get('/ai/snapshot', protect, getAiSnapshot);

export default router;
