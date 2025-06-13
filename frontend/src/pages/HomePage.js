// frontend/src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const HomePage = () => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <h1 className="display-4 fw-bold mb-3">Errands, Simplified.</h1>
            <p className="lead text-muted mb-4">Your one-stop solution for getting things done.</p>
            <div>
                <Link to="/login">
                    <Button 
                        variant="primary" 
                        size="lg" 
                        className="me-3"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                            border: 'none',
                            padding: '0.8rem 2rem'
                        }}
                    >
                        Get Started
                    </Button>
                </Link>
                <Link to="/register">
                    <Button variant="outline-secondary" size="lg" style={{padding: '0.8rem 2rem'}}>
                        Sign Up
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
