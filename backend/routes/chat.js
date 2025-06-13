import express from 'express';
import { getChatHistory } from '../controllers/chatController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET api/chat/:taskId
// @desc    Get all messages for a specific task
router.get('/:taskId', authMiddleware, getChatHistory);

export default router;
