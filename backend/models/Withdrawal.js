import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema({
    errander: { type: mongoose.Schema.Types.ObjectId, ref: 'Errander', required: true },
    amount: { type: Number, required: true },
    mpesaNumber: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    transactionId: { type: String } // To store M-Pesa transaction ID
}, { timestamps: true });

export default mongoose.model('Withdrawal', withdrawalSchema);
