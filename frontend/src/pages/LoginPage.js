import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { Form, Button, Alert, Spinner, Container } from 'react-bootstrap';
import './Auth.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await authService.login(email, password);
            setLoading(false);
            // On success, the backend sends an OTP. Navigate to the OTP verification page.
            // We pass the userId in the navigation state so the next page knows who is verifying.
            navigate('/verify-otp', { state: { userId: response.data.userId } });
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Welcome Back!</h2>
                </div>
                <div className="auth-body">
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        
                        <Button className="auth-btn" type="submit" disabled={loading}>
                            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/> : 'Login'}
                        </Button>
                    </Form>
                    <div className="auth-footer">
                        Don't have an account? <Link to="/register">Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
