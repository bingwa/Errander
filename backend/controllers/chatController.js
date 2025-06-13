import Message from '../models/Message.js';
import Task from '../models/Task.js';
import Errander from '../models/Errander.js';

export const getChatHistory = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found.' });
        }
        
        // --- THIS IS THE CORRECTED AUTHORIZATION LOGIC ---
        let erranderUserId = null;
        if (task.errander) {
            const errander = await Errander.findById(task.errander);
            if (errander) {
                erranderUserId = errander.user.toString();
            }
        }
        
        if (task.user.toString() !== req.user.id && erranderUserId !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to view this chat.' });
        }
        
        const messages = await Message.find({ taskId }).sort({ createdAt: 'asc' });
        res.json(messages);

    } catch (err) {
        console.error("Error fetching chat history:", err.message);
        res.status(500).send('Server Error');
    }
};
