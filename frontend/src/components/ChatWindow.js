import React, { useState, useEffect, useRef, useContext } from 'react';
import { Modal, Button, Form, InputGroup, ListGroup } from 'react-bootstrap';
import io from 'socket.io-client';
import chatService from '../services/chatService';
import AuthContext from '../context/AuthContext';
import './ChatWindow.css'; // We will create this CSS file next

const SOCKET_URL = 'http://localhost:5000';

const ChatWindow = ({ show, handleClose, taskId, recipientName }) => {
    const { user, token } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socketRef = useRef(null);
    const messageEndRef = useRef(null);

    useEffect(() => {
        if (show) {
            // Fetch message history when chat opens
            chatService.getChatHistory(taskId, token)
                .then(res => setMessages(res.data))
                .catch(err => console.error("Failed to fetch chat history", err));

            // Connect to WebSocket
            socketRef.current = io(SOCKET_URL);
            socketRef.current.emit('joinTaskRoom', taskId);
            
            socketRef.current.on('receiveMessage', (message) => {
                setMessages(prevMessages => [...prevMessages, message]);
            });

            return () => socketRef.current.disconnect();
        }
    }, [show, taskId, token]);

    useEffect(() => {
        // Scroll to the latest message
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const messageData = {
            taskId,
            sender: user.id, // Assumes user.id from token is the User model's _id
            text: newMessage,
        };

        socketRef.current.emit('sendMessage', messageData);
        setNewMessage('');
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Chat with {recipientName}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="chat-body">
                <ListGroup variant="flush">
                    {messages.map((msg) => (
                        <ListGroup.Item key={msg._id} className={`d-flex ${msg.sender === user.id ? 'justify-content-end' : ''}`}>
                            <div className={`message-bubble ${msg.sender === user.id ? 'sent' : 'received'}`}>
                                {msg.text}
                                <div className="message-timestamp">{new Date(msg.createdAt).toLocaleTimeString()}</div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <div ref={messageEndRef} />
            </Modal.Body>
            <Modal.Footer>
                <Form onSubmit={handleSendMessage} className="w-100">
                    <InputGroup>
                        <Form.Control 
                            placeholder="Type a message..." 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button variant="primary" type="submit">Send</Button>
                    </InputGroup>
                </Form>
            </Modal.Footer>
        </Modal>
    );
};

export default ChatWindow;
