// frontend/src/pages/BookingPage.js
import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import taskService from '../services/taskService';
import AuthContext from '../context/AuthContext';
import './BookingPage.css';

const BookingPage = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    
    const [taskData, setTaskData] = useState({
        description: '',
        pickupAddress: '',
        dropoffAddress: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { description, pickupAddress, dropoffAddress } = taskData;

    const onChange = e => setTaskData({ ...taskData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const finalTaskData = {
            serviceId,
            description,
            pickupLocation: { address: pickupAddress, coordinates: [0, 0] }, // Placeholder coordinates
            dropoffLocation: { address: dropoffAddress, coordinates: [0, 0] }, // Placeholder coordinates
        };

        try {
            const res = await taskService.createTask(finalTaskData, token);
            setLoading(false);
            // Navigate to a confirmation page or the map view
            alert('Task created successfully!');
            navigate(`/find-errander/${res.data._id}`); // We will create this page next
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.msg || 'Failed to create task.');
        }
    };

    return (
        <div className="booking-container">
            <div className="booking-header">
                <h3>Task Details</h3>
                <p>Please provide the details for your errand.</p>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Task Description</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={4} 
                        name="description" 
                        value={description} 
                        onChange={onChange} 
                        required 
                        placeholder="e.g., Please buy 2 litres of milk, a loaf of bread, and a block of cheese from Naivas."
                    />
                </Form.Group>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Pickup Location</Form.Label>
                            <Form.Control type="text" name="pickupAddress" value={pickupAddress} onChange={onChange} required placeholder="e.g., Naivas Supermarket, Nyali" />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Drop-off Location</Form.Label>
                            <Form.Control type="text" name="dropoffAddress" value={dropoffAddress} onChange={onChange} required placeholder="e.g., My Home Address" />
                        </Form.Group>
                    </Col>
                </Row>
                <Button className="booking-btn" type="submit" disabled={loading}>
                    {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Find an Errand Runner'}
                </Button>
            </Form>
        </div>
    );
};

export default BookingPage;
