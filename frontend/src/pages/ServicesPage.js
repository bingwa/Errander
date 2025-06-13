// frontend/src/pages/ServicesPage.js
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import serviceService from '../services/serviceService';
import './ServicesPage.css';

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await serviceService.getAllServices();
                setServices(res.data);
            } catch (err) {
                setError('Could not fetch services. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleServiceClick = (service) => {
        // FIX: This now navigates to the booking page with the service ID
        navigate(`/booking/${service._id}`);
    };

    if (loading) {
        return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
    }

    return (
        <div className="container py-5">
            <div className="services-header">
                <h2>How can we help you today?</h2>
                <p>Choose a service below to find an available errand runner.</p>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            <Row xs={1} md={2} lg={3} className="g-4">
                {services.map((service) => (
                    <Col key={service._id}>
                        <Card className="service-card h-100" onClick={() => handleServiceClick(service)}>
                            <Card.Body>
                                <div className="service-icon">{service.iconUrl}</div>
                                <Card.Title as="h5">{service.name}</Card.Title>
                                <Card.Text>{service.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ServicesPage;
