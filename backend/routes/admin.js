// backend/routes/admin.js
import express from 'express';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { getPendingErranders, approveErrander, denyErrander } from '../controllers/adminController.js';

const router = express.Router();

// @route   GET api/admin/pending-erranders
// @desc    Get all errander profiles pending verification
// @access  Admin
router.get('/pending-erranders', adminMiddleware, getPendingErranders);

// @route   PUT api/admin/approve-errander/:id
// @desc    Approve an errander's profile
// @access  Admin
router.put('/approve-errander/:id', adminMiddleware, approveErrander);

// @route   DELETE api/admin/deny-errander/:id
// @desc    Deny and delete an errander's profile
// @access  Admin
router.delete('/deny-errander/:id', adminMiddleware, denyErrander);

export default router;
