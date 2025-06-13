import mongoose from 'mongoose';

const erranderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    idDocument: { type: String, required: true },
    goodConductCertificate: { type: String, required: true },
    profilePicture: { type: String },
    isVerified: { type: Boolean, default: false },
    availabilityStatus: { type: String, enum: ['available', 'busy', 'offline'], default: 'offline' },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], index: '2dsphere' }
    },
    currentRating: { type: Number, default: 5.0 },
    ratingSum: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    // --- THIS FIELD WAS MISSING ---
    jobsCompleted: { type: Number, default: 0 }, 
}, { timestamps: true });

export default mongoose.model('Errander', erranderSchema);