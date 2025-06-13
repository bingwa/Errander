import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import taskService from '../services/taskService';
import AuthContext from '../context/AuthContext';

const CheckoutPage = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTask = async () => { 
            try { 
                const res = await taskService.getTaskDetails(taskId, token); 
                setTask(res.data); 
            } catch (err) { 
                setError('Could not retrieve task details for checkout.'); 
            } finally { 
                setLoading(false); 
            }};
        fetchTask();
    }, [taskId, token]);

    const handlePayment = async () => {
        setLoading(true);
        try {
            await taskService.checkoutTask(taskId, token);
            alert('Payment Successful!');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Payment failed. Please try again.');
            setLoading(false);
        }
    };

    if (loading) return <Container className="text-center mt-5"><Spinner /></Container>;
    if (error && !task) return <Container><Alert variant="danger">{error}</Alert></Container>;
    if (!task) return null;

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{minHeight: '80vh'}}>
            <Card className="text-center w-100" style={{maxWidth: '500px'}}>
                <Card.Header as="h4">Checkout</Card.Header>
                <Card.Body>
                    <Card.Title>Complete Your Payment</Card.Title>
                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                    <Card.Text>You are paying for task: {task.description}</Card.Text>
                    <h2 className="my-4">${task.estimatedPrice}</h2>
                    <p className="text-muted">This is a simulation. No real payment will be processed.</p>
                    <Button variant="primary" size="lg" onClick={handlePayment} disabled={loading}>
                        {loading ? 'Processing...' : 'Pay Now'}
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CheckoutPage;
