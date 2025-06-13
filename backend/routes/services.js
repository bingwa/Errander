// backend/routes/services.js
import express from 'express';
import { getServices } from '../controllers/serviceController.js';

const router = express.Router();

// @route   GET api/services
// @desc    Get all available services
// @access  Public
router.get('/', getServices);

export default router;
