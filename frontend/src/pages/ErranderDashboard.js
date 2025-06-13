import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Tabs, Tab, Table, Badge, Modal, Form, InputGroup } from 'react-bootstrap';
import taskService from '../services/taskService';
import erranderService from '../services/erranderService';
import withdrawalService from '../services/withdrawalService';
import AuthContext from '../context/AuthContext';
import ChatWindow from '../components/ChatWindow';
import io from 'socket.io-client';
import './ErranderDashboard.css';

const SOCKET_URL = 'http://localhost:5000';
const StatCard = ({ icon, title, value, colorClass, onWithdraw }) => ( <div className="stat-card h-100"><div className={`icon ${colorClass}`}>{icon}</div><h4 className="fw-bold">{value}</h4><p className="text-muted">{title}</p>{onWithdraw && <Button variant="success" size="sm" className="mt-2" onClick={onWithdraw}>Withdraw</Button>}</div> );
const AvailableJobCard = ({ task, onApply }) => ( <Card className="mb-3 shadow-sm"><Card.Header as="h5">{task.service.name}</Card.Header><Card.Body><Card.Text>{task.description}</Card.Text><Card.Text><strong>Est. Payout:</strong> ${task.estimatedPrice}</Card.Text><Button variant="success" onClick={() => onApply(task._id)}>Apply</Button></Card.Body></Card> );
const MyTaskItem = ({ task, onUpdateStatus, onOpenChat }) => ( <Card className="mb-3 shadow-sm"><Card.Header className="d-flex justify-content-between align-items-center"><span>Task for User: ...{task.user._id.slice(-6)}</span><span className="fw-bold text-primary text-capitalize">{task.status.replace('_', ' ')}</span></Card.Header><Card.Body><Card.Text><strong>Description:</strong> {task.description}</Card.Text><div className="d-flex gap-2">{task.status === 'accepted' && <Button variant="primary" onClick={() => onUpdateStatus(task._id, 'in_progress')}>Start Task</Button>}{task.status === 'in_progress' && <Button variant="success" onClick={() => onUpdateStatus(task._id, 'completed')}>Mark as Complete</Button>}<Button variant="outline-secondary" onClick={() => onOpenChat(task)}>Chat with User</Button></div></Card.Body></Card> );

const ErranderDashboard = () => {
    const { token } = useContext(AuthContext);
    const [summary, setSummary] = useState({ walletBalance: '0.00', jobsCompleted: 0, rating: '5.0' });
    const [pendingTasks, setPendingTasks] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [mpesaNumber, setMpesaNumber] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const socketRef = useRef(null);
    const fetchData = useCallback(async () => { if (!token) return; setLoading(true); try { const [summaryRes, pendingRes, myTasksRes, historyRes] = await Promise.all([ erranderService.getDashboardSummary(token), taskService.getPendingTasks(token), taskService.getAssignedTasks(token), taskService.getPaymentHistory(token) ]); setSummary(summaryRes.data); setPendingTasks(pendingRes.data); setMyTasks(myTasksRes.data); setPaymentHistory(historyRes.data); } catch (err) { setError('Failed to load dashboard data.'); } finally { setLoading(false); } }, [token]);
    useEffect(() => {
        fetchData();
        socketRef.current = io(SOCKET_URL);
        socketRef.current.emit('joinErranderRoom');
        socketRef.current.on('newTaskAvailable', () => { taskService.getPendingTasks(token).then(res => setPendingTasks(res.data)); });
        socketRef.current.on('taskTaken', ({ taskId }) => { setPendingTasks(prev => prev.filter(task => task._id !== taskId)); });
        return () => { if (socketRef.current) socketRef.current.disconnect(); };
    }, [fetchData, token]);
    const handleApplyForTask = async (taskId) => { try { await taskService.assignTask(taskId, token); alert('You got the job!'); fetchData(); } catch (err) { alert('Could not apply for task.'); setPendingTasks(prev => prev.filter(task => task._id !== taskId)); }};
    const handleUpdateStatus = async (taskId, status) => { try { await taskService.updateTaskStatus(taskId, status, token); fetchData(); } catch (err) { alert('Failed to update status.'); }};
    const handleOpenChat = (task) => { setSelectedTask(task); setShowChat(true); };
    const handleWithdraw = async (e) => { e.preventDefault(); if (!withdrawAmount || !mpesaNumber) return; try { await withdrawalService.requestWithdrawal({ amount: withdrawAmount, mpesaNumber }, token); alert('Withdrawal successful!'); setShowWithdrawModal(false); setWithdrawAmount(''); fetchData(); } catch (err) { alert(err.response?.data?.msg || 'Withdrawal failed.'); }};
    if (loading) return <Container className="text-center mt-5"><Spinner /></Container>;
    const activeTasks = myTasks.filter(t => t.status !== 'completed' && t.status !== 'paid' && t.status !== 'cancelled');
    return (
        <><div className="dashboard-container p-lg-4 p-md-3 p-2"><h2 className="mb-4 fw-bold">Errander Dashboard</h2>{error && <Alert variant="danger">{error}</Alert>}<Row className="mb-4 g-3"><Col md={4}><StatCard icon="💰" title="Wallet" value={`$${summary.walletBalance}`} colorClass="wallet-icon" onWithdraw={() => setShowWithdrawModal(true)} /></Col><Col md={4}><StatCard icon="📦" title="Jobs Completed" value={summary.jobsCompleted} colorClass="jobs-icon" /></Col><Col md={4}><StatCard icon="⭐" title="Your Rating" value={summary.rating} colorClass="rating-icon" /></Col></Row><div className="tasks-section"><Tabs defaultActiveKey="available" id="errander-tabs" className="mb-3" justify><Tab eventKey="available" title={<>Available Jobs <Badge bg="success">{pendingTasks.length}</Badge></>}><div className="p-2">{pendingTasks.length > 0 ? pendingTasks.map(task => <AvailableJobCard key={task._id} task={task} onApply={handleApplyForTask} />) : <Alert variant="light" className="text-center">No jobs available right now.</Alert>}</div></Tab><Tab eventKey="my-tasks" title={<>My Jobs <Badge bg="primary">{activeTasks.length}</Badge></>}><div className="p-2">{activeTasks.length > 0 ? myTasks.map(task => <MyTaskItem key={task._id} task={task} onUpdateStatus={handleUpdateStatus} onOpenChat={handleOpenChat} />) : <Alert variant="light">You have no active jobs.</Alert>}</div></Tab><Tab eventKey="payments" title="Payment History"><div className="p-2"><Table striped bordered hover responsive><thead><tr><th>Date</th><th>Task</th><th>Payout</th></tr></thead><tbody>{paymentHistory.length > 0 ? paymentHistory.map(p => (<tr key={p._id}><td>{new Date(p.createdAt).toLocaleDateString()}</td><td>{p.description.substring(0, 50)}...</td><td>${p.finalPrice || p.estimatedPrice}</td></tr>)) : <tr><td colSpan="3" className="text-center">No payment history.</td></tr>}</tbody></Table></div></Tab></Tabs></div></div>
        {selectedTask && <ChatWindow show={showChat} handleClose={() => setShowChat(false)} taskId={selectedTask._id} recipientName={`User (...${selectedTask.user._id.slice(-6)})`}/>}
        <Modal show={showWithdrawModal} onHide={() => setShowWithdrawModal(false)} centered><Modal.Header closeButton><Modal.Title>Withdraw Funds</Modal.Title></Modal.Header><Modal.Body><Form onSubmit={handleWithdraw}><p>Available: <strong>${summary.walletBalance}</strong></p><Form.Group className="mb-3"><Form.Label>Amount</Form.Label><InputGroup><InputGroup.Text>$</InputGroup.Text><Form.Control type="number" placeholder="0.00" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} required /></InputGroup></Form.Group><Form.Group className="mb-3"><Form.Label>M-Pesa Number</Form.Label><Form.Control type="tel" placeholder="254712345678" value={mpesaNumber} onChange={e => setMpesaNumber(e.target.value)} required /></Form.Group><Button variant="primary" type="submit" className="w-100">Confirm Withdrawal</Button></Form></Modal.Body></Modal></>
    );
};
export default ErranderDashboard;
