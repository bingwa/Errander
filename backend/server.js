// backend/server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import erranderRoutes from './routes/errander.js';
import adminRoutes from './routes/admin.js';
import serviceRoutes from './routes/services.js';
import taskRoutes from './routes/tasks.js';
import chatRoutes from './routes/chat.js';
import withdrawalRoutes from './routes/withdrawal.js';
import Message from './models/Message.js';
import Task from './models/Task.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:3000" } });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- THIS IS THE KEY UPDATE ---
// Add middleware to attach the `io` (WebSocket server) instance to every API request.
// This allows our controllers to send real-time events.
app.use((req, res, next) => {
    req.io = io;
    next();
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/erranderApp').then(() => console.log("MongoDB connected.")).catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/erranders', erranderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/withdraw', withdrawalRoutes);

// We define a specific "room" that all online erranders will join.
const ERRANDER_ROOM = 'available_erranders_room';

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // When an errander's dashboard connects, it joins the global errander room
    socket.on('joinErranderRoom', () => {
        socket.join(ERRANDER_ROOM);
        console.log(`Socket ${socket.id} joined the main errander room.`);
    });

    // When a user OR errander opens a chat, they join a specific room for that task
    socket.on('joinTaskRoom', (taskId) => { 
        socket.join(taskId); 
    });
    
    // For location tracking
    socket.on('updateLocation', (data) => { 
        io.to(data.taskId).emit('locationUpdate', data.location); 
    });

    // For chat messages
    socket.on('sendMessage', async (data) => {
        const { taskId, sender, text } = data;
        try {
            const task = await Task.findById(taskId).populate({ path: 'errander', select: 'user' });
            if (!task || !task.errander) return;
            const receiverId = task.user.toString() === sender ? task.errander.user : task.user;
            const newMessage = new Message({ taskId, sender, receiver: receiverId, text });
            await newMessage.save();
            io.to(taskId).emit('receiveMessage', newMessage);
        } catch (error) { console.error("Chat Error:", error); }
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
