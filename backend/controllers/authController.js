// backend/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Mock function for sending OTP.
const sendOtp = async (phoneNumber, otp) => {
    console.log(`--- OTP Service ---`);
    console.log(`Sending OTP ${otp} to ${phoneNumber}`);
    console.log(`--- End OTP Service ---`);
    return true; // Assume success for mock
};


export const register = async (req, res) => {
    const { email, password, phoneNumber } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }
        
        user = await User.findOne({ phoneNumber });
        if (user) {
            return res.status(400).json({ msg: 'User with this phone number already exists' });
        }

        user = new User({
            email,
            password,
            phoneNumber
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        
        res.status(201).json({ msg: 'User registered successfully. Please log in.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.phoneOtp = otp;
        user.phoneOtpExpires = otpExpires;
        await user.save();
        
        await sendOtp(user.phoneNumber, otp);

        res.json({ msg: 'OTP sent to your phone number. Please verify to continue.', userId: user.id });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


export const verifyOtp = async (req, res) => {
    const { userId, otp } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ msg: 'User not found.' });
        }

        if (user.phoneOtp !== otp || user.phoneOtpExpires < new Date()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP. Please try logging in again.' });
        }

        user.phoneOtp = undefined;
        user.phoneOtpExpires = undefined;
        await user.save();

        // THIS IS THE CRITICAL PART
        // We MUST include isAdmin in the payload here.
        const payload = {
            user: {
                id: user.id,
                isErrander: user.isErrander,
                isAdmin: user.isAdmin // Ensure this line exists
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your_default_jwt_secret',
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
