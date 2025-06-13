// backend/controllers/taskController.js
import Task from '../models/Task.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import Errander from '../models/Errander.js';

// --- UPDATED createTask FUNCTION ---
export const createTask = async (req, res) => {
    const { serviceId, description, pickupLocation, dropoffLocation } = req.body;
    const userId = req.user.id;
    try {
        const service = await Service.findById(serviceId);
        if (!service) { return res.status(404).json({ msg: 'Service not found' }); }
        const user = await User.findById(userId);
        if(!user){ return res.status(404).json({ msg: 'User not found' }); }
        const distance = Math.random() * 10;
        const estimatedPrice = service.baseRate + (distance * 1.5) + (description.length * 0.05);
        const newTask = new Task({ user: userId, service: serviceId, description, pickupLocation, dropoffLocation, estimatedPrice: estimatedPrice.toFixed(2), status: 'pending', userPhoneNumber: user.phoneNumber });
        await newTask.save();
        
        // This is the new line: It sends a message to all erranders.
        req.io.to('available_erranders_room').emit('newTaskAvailable');
        
        res.status(201).json(newTask);
    } catch (err) {
        console.error("Error in createTask:", err.message);
        res.status(500).send('Server Error');
    }
};

// --- UPDATED assignTask FUNCTION ---
export const assignTask = async (req, res) => {
    const { taskId } = req.params;
    const { erranderId } = req.body; // The ID of the errander the user clicked on.
    const requestingUserId = req.user.id; // The ID of the user making the request.

    try {
        const task = await Task.findById(taskId);
        if (!task) { return res.status(404).json({ msg: 'Task not found.' }); }

        // Authorization: Make sure the person making the request is the one who created the task.
        if (task.user.toString() !== requestingUserId) {
            return res.status(403).json({ msg: 'User not authorized to assign this task.' });
        }
        if (task.status !== 'pending') {
            return res.status(400).json({ msg: 'This task has already been assigned.' });
        }

        const errander = await Errander.findById(erranderId);
        if (!errander) { return res.status(404).json({ msg: 'Errander not found.' }); }

        const erranderUser = await User.findById(errander.user);
        if (!erranderUser) { return res.status(404).json({ msg: 'Errander user data not found.' }); }

        // All checks passed. Perform the assignment.
        task.errander = erranderId;
        task.status = 'accepted';
        task.erranderPhoneNumber = erranderUser.phoneNumber;
        
        errander.availabilityStatus = 'busy';
        
        await task.save();
        await errander.save();

        res.json({ msg: 'Task assigned successfully', task });

    } catch (err) {
        console.error("--- Backend Error in assignTask: ---", err.message);
        res.status(500).send('Server Error');
    }
};


// --- ALL OTHER FUNCTIONS REMAIN THE SAME ---

export const getAssignedTasks = async (req, res) => {
    try {
        const erranderProfile = await Errander.findOne({ user: req.user.id });
        if (!erranderProfile) { return res.status(404).json({ msg: 'Errander profile not found.' }); }
        const tasks = await Task.find({ errander: erranderProfile._id }).populate('user', 'email');
        res.json(tasks);
    } catch (err) { res.status(500).send('Server Error'); }
};

export const updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    try {
        const task = await Task.findById(taskId);
        if (!task) { return res.status(404).json({ msg: 'Task not found' }); }
        task.status = status;
        await task.save();
        res.json(task);
    } catch (err) { res.status(500).send('Server Error'); }
};

export const getTaskDetails = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId).populate('user', 'email').populate({ path: 'errander', select: 'firstName lastName profilePicture location' });
        if (!task) { return res.status(404).json({ msg: 'Task not found' }); }
        res.json(task);
    } catch (err) { res.status(500).send('Server Error'); }
};

export const getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).populate('errander', 'firstName lastName').sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) { res.status(500).send('Server Error'); }
};

export const rateTask = async (req, res) => {
    const { rating, feedback } = req.body;
    const { taskId } = req.params;
    try {
        const task = await Task.findById(taskId);
        if (!task || task.user.toString() !== req.user.id || task.status !== 'paid' || task.rating) {
            return res.status(400).json({ msg: 'Task cannot be rated.' });
        }
        task.rating = rating;
        task.feedback = feedback || '';
        await task.save();
        const errander = await Errander.findById(task.errander);
        if (errander) {
            errander.ratingSum += rating;
            errander.ratingCount += 1;
            errander.currentRating = (errander.ratingSum / errander.ratingCount).toFixed(1);
            await errander.save();
        }
        res.json(task);
    } catch (err) { res.status(500).send('Server Error'); }
};

export const getPendingTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ status: 'pending' }).populate('user', 'email').populate('service', 'name').sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) { res.status(500).send('Server Error'); }
};

export const getPaymentHistory = async (req, res) => {
    try {
        const errander = await Errander.findOne({ user: req.user.id });
        if (!errander) { return res.status(404).json({ msg: 'Errander profile not found' }); }
        const tasks = await Task.find({ errander: errander._id, status: 'paid' }).select('description finalPrice estimatedPrice createdAt').sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) { res.status(500).send('Server Error'); }
};

export const checkoutTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task || task.user.toString() !== req.user.id || task.status !== 'completed') {
            return res.status(400).json({ msg: 'Task not ready for checkout.' });
        }
        task.finalPrice = task.estimatedPrice;
        task.status = 'paid';
        await Errander.findByIdAndUpdate(task.errander, { $inc: { jobsCompleted: 1 }, $set: { availabilityStatus: 'available' } });
        await task.save();
        res.json(task);
    } catch (err) { res.status(500).send('Server Error'); }
};

export const cancelTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) { return res.status(404).json({ msg: 'Task not found' }); }
        if (task.user.toString() !== req.user.id) { return res.status(401).json({ msg: 'User not authorized' }); }
        if (task.status !== 'pending') { return res.status(400).json({ msg: 'Only pending tasks can be cancelled.' }); }
        task.status = 'cancelled';
        await task.save();
        res.json({ msg: 'Task successfully cancelled.', task });
    } catch (err) { res.status(500).send('Server Error'); }
};
