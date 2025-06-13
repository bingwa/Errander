// backend/routes/tasks.js
import express from 'express';
import { 
    createTask, assignTask, getAssignedTasks, updateTaskStatus, getTaskDetails, 
    getUserTasks, rateTask, getPendingTasks, getPaymentHistory, checkoutTask, cancelTask
} from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/pending', authMiddleware, getPendingTasks);
router.get('/payment-history', authMiddleware, getPaymentHistory);
router.post('/', authMiddleware, createTask);
router.get('/user/history', authMiddleware, getUserTasks);
router.get('/assigned', authMiddleware, getAssignedTasks);
router.get('/:taskId', authMiddleware, getTaskDetails);
router.put('/assign/:taskId', authMiddleware, assignTask);
router.put('/status/:taskId', authMiddleware, updateTaskStatus);
router.put('/rate/:taskId', authMiddleware, rateTask);
router.put('/checkout/:taskId', authMiddleware, checkoutTask);
router.put('/cancel/:taskId', authMiddleware, cancelTask);

export default router;