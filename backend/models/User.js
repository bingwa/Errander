// backend/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isErrander: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    phoneOtp: String,
    phoneOtpExpires: Date,
}, { timestamps: true });

export default mongoose.model('User', userSchema);
