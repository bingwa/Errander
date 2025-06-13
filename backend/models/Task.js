// backend/models/Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    errander: { type: mongoose.Schema.Types.ObjectId, ref: 'Errander' }, 
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'in_progress', 'completed', 'paid', 'cancelled'], default: 'pending' },
    pickupLocation: {
        address: String,
        coordinates: { type: [Number] }
    },
    dropoffLocation: {
        address: String,
        coordinates: { type: [Number] }
    },
    estimatedPrice: { type: Number },
    finalPrice: { type: Number },
    userPhoneNumber: { type: String },
    erranderPhoneNumber: { type: String },
    trackingHistory: [{
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: [Number]
        },
        timestamp: { type: Date, default: Date.now }
    }],
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String },
    feedbackReason: { type: String }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
