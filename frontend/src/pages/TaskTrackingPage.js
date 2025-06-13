import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Spinner, Alert, Badge, Container, Button } from 'react-bootstrap';
import L from 'leaflet';
import io from 'socket.io-client';
import taskService from '../services/taskService';
import AuthContext from '../context/AuthContext';
import ChatWindow from '../components/ChatWindow';
import './TaskTrackingPage.css';

const SOCKET_URL = 'http://localhost:5000';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'), iconUrl: require('leaflet/dist/images/marker-icon.png'), shadowUrl: require('leaflet/dist/images/marker-shadow.png') });
const MapUpdater = ({ position }) => { const map = useMap(); useEffect(() => { if (position) { map.flyTo(position, 16); } }, [position, map]); return null; };

const TaskTrackingPage = () => {
    const { taskId } = useParams();
    const { token } = useContext(AuthContext);
    const [task, setTask] = useState(null);
    const [erranderPosition, setErranderPosition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showChat, setShowChat] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        const fetchTaskDetails = async () => { if (!token || !taskId) { setLoading(false); return; } try { const res = await taskService.getTaskDetails(taskId, token); setTask(res.data); if (res.data.errander?.location?.coordinates) { setErranderPosition([res.data.errander.location.coordinates[1], res.data.errander.location.coordinates[0]]); } } catch (err) { setError('Could not fetch task details.'); } finally { setLoading(false); } };
        fetchTaskDetails();
        socketRef.current = io(SOCKET_URL);
        socketRef.current.emit('joinTaskRoom', taskId);
        socketRef.current.on('locationUpdate', (location) => setErranderPosition([location.latitude, location.longitude]));
        return () => { if (socketRef.current) socketRef.current.disconnect(); };
    }, [taskId, token]);
    
    if (loading) return <Container className="text-center mt-5"><Spinner /></Container>;
    if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;
    if (!task) return <Alert variant="warning" className="m-4">Task not found.</Alert>;

    const initialPosition = erranderPosition || [-1.286389, 36.817223];

    return (
        <>
            <div className="tracking-container">
                <div className="tracking-header d-flex justify-content-between align-items-center">
                    <div><h3>Tracking Your Errand</h3><p className="mb-0">Status: <Badge bg="primary" className="status-badge">{task.status.replace('_', ' ')}</Badge></p></div>
                    {task.errander && (<Button variant="outline-primary" onClick={() => setShowChat(true)}>Chat with {task.errander.firstName}</Button>)}
                </div>
                <MapContainer center={initialPosition} zoom={13} className="tracking-map-container">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {erranderPosition && <Marker position={erranderPosition}><Popup>Your errander is here.</Popup></Marker>}
                    <MapUpdater position={erranderPosition} />
                </MapContainer>
            </div>
            {task.errander && <ChatWindow show={showChat} handleClose={() => setShowChat(false)} taskId={taskId} recipientName={task.errander.firstName}/>}
        </>
    );
};

export default TaskTrackingPage;
