// backend/controllers/withdrawalController.js
import Withdrawal from '../models/Withdrawal.js';
import Errander from '../models/Errander.js';
import Task from '../models/Task.js';

export const requestWithdrawal = async (req, res) => {
    const { amount, mpesaNumber } = req.body;
    try {
        const errander = await Errander.findOne({ user: req.user.id });
        if (!errander) return res.status(404).json({ msg: 'Errander profile not found.' });

        // Calculate wallet balance
        const paidTasks = await Task.find({ errander: errander._id, status: 'paid' });
        const totalEarnings = paidTasks.reduce((acc, task) => acc + (task.finalPrice || 0), 0);
        
        const completedWithdrawals = await Withdrawal.find({ errander: errander._id, status: 'completed' });
        const totalWithdrawn = completedWithdrawals.reduce((acc, w) => acc + w.amount, 0);

        const availableBalance = totalEarnings - totalWithdrawn;

        if (amount > availableBalance) {
            return res.status(400).json({ msg: 'Insufficient funds for withdrawal.' });
        }
        
        // --- M-Pesa API Simulation ---
        console.log(`--- M-PESA B2C SIMULATION ---`);
        console.log(`Initiating payment of KES ${amount} to ${mpesaNumber}`);
        const transactionId = `MPESA_${Date.now()}`;
        console.log(`Transaction successful with ID: ${transactionId}`);
        
        const newWithdrawal = new Withdrawal({
            errander: errander._id,
            amount,
            mpesaNumber,
            status: 'completed', // Simulating instant success
            transactionId
        });
        await newWithdrawal.save();
        res.status(201).json({ msg: 'Withdrawal request successful!', withdrawal: newWithdrawal });

    } catch (err) {
        console.error("Withdrawal Error:", err);
        res.status(500).send('Server Error');
    }
};
