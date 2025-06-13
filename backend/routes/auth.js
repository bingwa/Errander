// backend/routes/auth.js
import express from 'express';
import { register, login, verifyOtp } from '../controllers/authController.js';

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   POST api/auth/verify-otp
// @desc    Verify phone OTP for 2FA
// @access  Public
router.post('/verify-otp', verifyOtp);

export default router;
