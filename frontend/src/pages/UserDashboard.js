import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Container, Spinner, Alert, Card, Modal, Form } from 'react-bootstrap';
import taskService from '../services/taskService';
import AuthContext from '../context/AuthContext';

const StarRating = ({ rating, setRating }) => ( <div className="my-3 text-center">{[...Array(5)].map((_, i) => <button type="button" key={i} className={i < rating ? "btn text-warning" : "btn text-secondary"} style={{ background: 'none', border: 'none', fontSize: '2.5rem', padding: '0 5px', boxShadow: 'none' }} onClick={() => setRating(i + 1)}>★</button>)}</div> );

const UserDashboard = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const fetchTasks = useCallback(async () => { 
        if (!token) return; 
        try { 
            const res = await taskService.getUserTasks(token); 
            setTasks(res.data); 
        } catch (e) { 
            setError("Failed to fetch task history.");
        } finally { 
            setLoading(false); 
        }}, [token]);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);
    
    const handleCheckout = (task) => navigate(`/checkout/${task._id}`);
    const handleShowRatingModal = (task) => { setSelectedTask(task); setShowModal(true); };
    const handleCloseModal = () => { setShowModal(false); setRating(0); setFeedback(''); setSelectedTask(null); };
    const handleRatingSubmit = async () => { if (rating === 0) return; try { await taskService.rateTask(selectedTask._id, { rating, feedback }, token); fetchTasks(); handleCloseModal(); } catch (e) { alert('Failed to submit rating.'); }};

    // --- NEW FUNCTION TO HANDLE CANCELLATION ---
    const handleCancelTask = async (taskId) => {
        if (window.confirm('Are you sure you want to cancel this pending task?')) {
            try {
                const res = await taskService.cancelTask(taskId, token);
                // Update the task in the list to show it's cancelled
                setTasks(tasks.map(t => t._id === taskId ? res.data.task : t));
            } catch (err) {
                alert('Failed to cancel the task. It may have already been accepted.');
            }
        }
    };

    if (loading) return <Container className="text-center mt-5"><Spinner /></Container>;

    return (
        <Container className="py-4">
            <div className="text-center mb-5"><h1 className="display-5 fw-bold">Your Dashboard</h1><p className="lead text-muted">Book a new service or review your past errands.</p><Link to="/services"><Button variant="primary" size="lg" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none'}}>Book a New Service</Button></Link></div>
            <h3 className="mb-3">Your Task History</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {tasks.length === 0 && !error ? <Alert variant="light">You have no tasks yet.</Alert> : tasks.map(task => (
                <Card key={task._id} className="mb-3 shadow-sm">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <div>
                                <Card.Title>Task ID: ...{task._id.slice(-6)}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Errander: {task.errander ? `${task.errander.firstName} ${task.errander.lastName}` : 'Not Assigned'}</Card.Subtitle>
                                <Card.Text><strong>Status:</strong> <span className="text-capitalize fw-bold">{task.status.replace('_', ' ')}</span></Card.Text>
                            </div>
                            <div className="mt-2 mt-md-0">
                                {/* --- NEW CONDITIONAL BUTTON --- */}
                                {task.status === 'pending' && (
                                    <Button variant="outline-danger" size="sm" onClick={() => handleCancelTask(task._id)}>Cancel Task</Button>
                                )}
                                {task.status === 'completed' && <Button variant="success" onClick={() => handleCheckout(task)}>Proceed to Checkout</Button>}
                                {task.status === 'paid' && !task.rating && <Button variant="warning" onClick={() => handleShowRatingModal(task)}>Rate Task</Button>}
                                {task.rating > 0 && <span className="text-warning fw-bold">Rated: {task.rating} ★</span>}
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            ))}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton><Modal.Title>Rate Your Experience</Modal.Title></Modal.Header>
                <Modal.Body className="text-center">
                    <p>How was your experience with <strong>{selectedTask?.errander?.firstName}</strong>?</p>
                    <StarRating rating={rating} setRating={setRating} />
                    <Form.Control as="textarea" rows={3} placeholder="Optional feedback..." value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                    <Button variant="primary" onClick={handleRatingSubmit}>Submit Rating</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
export default UserDashboard;
