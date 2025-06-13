// frontend/src/pages/BecomeErranderPage.js
import React, { useState, useContext } from 'react';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import erranderService from '../services/erranderService';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ErranderForm.css'; // Import the new styles

const BecomeErranderPage = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
    });
    const [idDocument, setIdDocument] = useState(null);
    const [goodConductCertificate, setGoodConductCertificate] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { firstName, lastName } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onFileChange = e => {
        if (e.target.name === 'idDocument') {
            setIdDocument(e.target.files[0]);
        } else {
            setGoodConductCertificate(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!idDocument || !goodConductCertificate) {
            setError('Please upload both documents.');
            setLoading(false);
            return;
        }

        const fullFormData = new FormData();
        fullFormData.append('firstName', firstName);
        fullFormData.append('lastName', lastName);
        fullFormData.append('idDocument', idDocument);
        fullFormData.append('goodConductCertificate', goodConductCertificate);

        try {
            await erranderService.createProfile(fullFormData, token);
            setLoading(false);
            setSuccess('Your profile has been submitted for review! You will be notified upon approval.');
            setTimeout(() => {
                navigate('/dashboard'); // Redirect to dashboard after success
            }, 3000);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.msg || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h3>Become an Errand Runner</h3>
                <p>Complete your profile to start accepting tasks and earning.</p>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" name="firstName" value={firstName} onChange={onChange} required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" name="lastName" value={lastName} onChange={onChange} required />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-4">
                    <Form.Label>National ID or Passport</Form.Label>
                    <div className="file-upload-wrapper">
                        <input type="file" name="idDocument" onChange={onFileChange} required />
                        <div className="file-upload-icon">📄</div>
                        <div>Click to upload your ID</div>
                        {idDocument && <div className="file-name">{idDocument.name}</div>}
                    </div>
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Label>Certificate of Good Conduct</Form.Label>
                    <div className="file-upload-wrapper">
                        <input type="file" name="goodConductCertificate" onChange={onFileChange} required />
                        <div className="file-upload-icon">📜</div>
                        <div>Click to upload your certificate</div>
                        {goodConductCertificate && <div className="file-name">{goodConductCertificate.name}</div>}
                    </div>
                </Form.Group>
                <Button className="submit-btn" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Submit for Review'}
                </Button>
            </Form>
        </div>
    );
};

export default BecomeErranderPage;
