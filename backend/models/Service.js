// backend/models/Service.js
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., "Grocery Delivery", "House Cleaning"
    description: { type: String },
    baseRate: { type: Number, required: true },
    iconUrl: { type: String }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
