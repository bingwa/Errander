// frontend/src/pages/FindErranderPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// THE FIX IS HERE: Added 'Container' to the import list
import { Spinner, Alert, Button, ButtonGroup, Row, Col, Card, Container } from 'react-bootstrap';
import L from 'leaflet';
import erranderService from '../services/erranderService';
import taskService from '../services/taskService';
import AuthContext from '../context/AuthContext';
import './FindErranderPage.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => { map.invalidateSize(); }, 100);
  }, [map]);
  return null;
};

const FindErranderPage = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [erranders, setErranders] = useState([]);
    const [view, setView] = useState('map');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) { setLoading(false); return; }
        const fetchErranders = async () => {
            try {
                const res = await erranderService.findNearby(token);
                setErranders(res.data);
            } catch (err) {
                setError('Could not find available errand runners.');
            } finally {
                setLoading(false);
            }
        };
        fetchErranders();
    }, [token]);

    const handleSelectErrander = async (erranderId) => {
        setError(''); // Clear previous errors
        try {
            // This now correctly calls the updated service with both the taskId and erranderId
            await taskService.assignTask(taskId, erranderId, token);
            alert('Errander assigned! You will now be taken to the tracking page.');
            navigate(`/track/${taskId}`);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to assign task. Please try again.');
        }
    };
    
    const renderContent = () => {
        if (erranders.length === 0) {
            return <Alert variant="info" className="text-center">No available errand runners were found. They may be busy or offline.</Alert>;
        }
        if (view === 'map') {
            return (
                <MapContainer center={[-1.286389, 36.817223]} zoom={13} style={{ height: '500px', width: '100%' }} scrollWheelZoom={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                    <MapResizer />
                    {erranders.map(e => (
                        <Marker key={e._id} position={[e.location.coordinates[1], e.location.coordinates[0]]}>
                            <Popup>
                                <strong>{e.firstName} {e.lastName}</strong><br/>
                                <Button size="sm" onClick={() => handleSelectErrander(e._id)}>Select</Button>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            );
        }
        return (
            <Row>{erranders.map(e => (
                <Col md={6} lg={4} key={e._id}>
                    <Card className="errander-list-card">
                        <Card.Body>
                            <Card.Title>{e.firstName} {e.lastName}</Card.Title>
                            <Card.Text>Rating: {e.currentRating} ★</Card.Text>
                            <Button onClick={() => handleSelectErrander(e._id)}>Select {e.firstName}</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
            </Row>
        );
    };

    if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;

    return (
        <div className="container py-4">
            <h2 className="text-center mb-3">Choose an Errand Runner</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <ButtonGroup className="view-toggle d-flex justify-content-center mb-4">
                <Button variant={view === 'map' ? 'primary' : 'outline-primary'} onClick={() => setView('map')}>Map View</Button>
                <Button variant={view === 'list' ? 'primary' : 'outline-primary'} onClick={() => setView('list')}>List View</Button>
            </ButtonGroup>
            {renderContent()}
        </div>
    );
};

export default FindErranderPage;
