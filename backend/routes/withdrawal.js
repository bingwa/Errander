import express from 'express';
import { requestWithdrawal } from '../controllers/withdrawalController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/', authMiddleware, requestWithdrawal);
export default router;