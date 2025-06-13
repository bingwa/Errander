// backend/routes/errander.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'; // This was the missing import
import uploadMiddleware from '../middleware/uploadMiddleware.js';
import { 
    createErranderProfile,
    updateErranderStatus,
    findNearbyErranders,
    getDashboardSummary
} from '../controllers/erranderController.js';

const router = express.Router();

// @route   POST api/erranders/profile
// @desc    Create or update an errander profile
// @access  Private
router.post(
    '/profile',
    authMiddleware,
    (req, res, next) => {
        uploadMiddleware(req, res, (err) => {
            if (err) {
                return res.status(400).json({ msg: err });
            }
            next();
        });
    },
    createErranderProfile
);

// @route   PUT api/erranders/status
// @desc    Update status (availability, location)
// @access  Private (Errander only)
router.put('/status', authMiddleware, updateErranderStatus);

// @route   GET api/erranders/find-nearby
// @desc    Find nearby available erranders
// @access  Private (User only)
router.get('/find-nearby', authMiddleware, findNearbyErranders);

// @route   GET api/erranders/dashboard-summary
// @desc    Get dashboard summary
// @access  Private (Errander)
router.get('/dashboard-summary', authMiddleware, getDashboardSummary);

export default router;
