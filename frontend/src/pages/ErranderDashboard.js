import React, { useState, useEffect } from 'react';
import { Card, Button, Statistic } from 'antd'; // FIX: Removed unused 'Form' and 'InputGroup'
// FIX: Removed unused 'withdrawalService' import
import taskService from '../services/taskService';
import { useNavigate } from 'react-router-dom';

const ErranderDashboard = () => {
    const [balance, setBalance] = useState(0);
    const [tasksCompleted, setTasksCompleted] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // FIX: Removed unused state variables: 
    // const [withdrawAmount, setWithdrawAmount] = useState('');
    // const [mpesaNumber, setMpesaNumber] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                // Example API calls
                const balanceRes = await taskService.getBalance(); 
                setBalance(balanceRes.data.balance);
                const tasksRes = await taskService.getCompletedTasks();
                setTasksCompleted(tasksRes.data.count);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // FIX: Removed unused 'handleWithdraw' function
    // const handleWithdraw = async (e) => { ... };

    const handleFindTasks = () => {
        navigate('/tasks');
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card loading={loading}>
                    <Statistic title="Current Balance" value={balance} prefix="Ksh" precision={2} />
                </Card>
                <Card loading={loading}>
                    <Statistic title="Tasks Completed" value={tasksCompleted} />
                </Card>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Actions</h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <Button type="primary" size="large" onClick={handleFindTasks}>
                        Find New Tasks
                    </Button>
                    <Button size="large">
                        View Task History
                    </Button>
                </div>
            </div>

            {/* The withdrawal form that was likely here has been removed
                as its state and handlers were unused. It can be re-added
                when it's ready to be implemented. */}
        </div>
    );
};

export default ErranderDashboard;
