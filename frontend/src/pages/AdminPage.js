// frontend/src/pages/AdminPage.js
import React, { useState, useEffect, useContext } from 'react';
import { Button, Alert, Spinner, Card } from 'react-bootstrap';
import adminService from '../services/adminService';
import AuthContext from '../context/AuthContext';
import './AdminPage.css';

const AdminPage = () => {
    const { token } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchApplications = async () => {
        try {
            const res = await adminService.getPendingErranders(token);
            setApplications(res.data);
        } catch (err) {
            setError('Failed to fetch applications.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [token]);

    const handleApprove = async (id) => {
        try {
            await adminService.approveErrander(id, token);
            setApplications(applications.filter(app => app._id !== id));
        } catch (err) {
            setError('Failed to approve application.');
        }
    };

    const handleDeny = async (id) => {
        try {
            await adminService.denyErrander(id, token);
            setApplications(applications.filter(app => app._id !== id));
        } catch (err) {
            setError('Failed to deny application.');
        }
    };
    
    const API_BASE_URL = 'http://localhost:5000';

    if (loading) {
        return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    }

    return (
        <div className="admin-container">
            <div className="admin-header mb-4">
                <h2>Pending Errand Runner Applications</h2>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            {applications.length === 0 ? (
                <Alert variant="info">No pending applications at the moment.</Alert>
            ) : (
                applications.map(app => (
                    <Card key={app._id} className="application-card">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div className="applicant-info">
                                <h5>{app.firstName} {app.lastName}</h5>
                                <p>Email: {app.user.email} | Phone: {app.user.phoneNumber}</p>
                                <div>
                                    <a href={`${API_BASE_URL}/${app.idDocument}`} target="_blank" rel="noopener noreferrer" className="document-link">View ID</a>
                                    <a href={`${API_BASE_URL}/${app.goodConductCertificate}`} target="_blank" rel="noopener noreferrer" className="document-link">View Certificate</a>
                                </div>
                            </div>
                            <div className="action-buttons">
                                <Button variant="success" onClick={() => handleApprove(app._id)}>Approve</Button>
                                <Button variant="danger" onClick={() => handleDeny(app._id)}>Deny</Button>
                            </div>
                        </Card.Body>
                    </Card>
                ))
            )}
        </div>
    );
};

export default AdminPage;

