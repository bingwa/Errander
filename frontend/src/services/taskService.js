// frontend/src/services/taskService.js
import axios from 'axios';
const API_URL = 'http://localhost:5000/api/tasks';

const taskService = {
    createTask: (data, token) => axios.post(API_URL, data, { headers: { 'x-auth-token': token } }),
    
    // NOTE: This function was updated to pass only the token, as the backend now gets the erranderId from the JWT.
    assignTask: (taskId, erranderId, token) => {
        return axios.put(`${API_URL}/assign/${taskId}`, { erranderId }, { headers: { 'x-auth-token': token } });
    },

    getAssignedTasks: (token) => axios.get(`${API_URL}/assigned`, { headers: { 'x-auth-token': token } }),
    
    updateTaskStatus: (taskId, status, token) => axios.put(`${API_URL}/status/${taskId}`, { status }, { headers: { 'x-auth-token': token } }),
    
    getTaskDetails: (taskId, token) => axios.get(`${API_URL}/${taskId}`, { headers: { 'x-auth-token': token } }),
    
    getUserTasks: (token) => axios.get(`${API_URL}/user/history`, { headers: { 'x-auth-token': token } }),
    
    rateTask: (taskId, ratingData, token) => axios.put(`${API_URL}/rate/${taskId}`, ratingData, { headers: { 'x-auth-token': token } }),
    
    getPendingTasks: (token) => axios.get(`${API_URL}/pending`, { headers: { 'x-auth-token': token } }),
    
    getPaymentHistory: (token) => axios.get(`${API_URL}/payment-history`, { headers: { 'x-auth-token': token } }),
    
    checkoutTask: (taskId, token) => axios.put(`${API_URL}/checkout/${taskId}`, null, { headers: { 'x-auth-token': token } }),

    // --- NEW FUNCTION ---
    cancelTask: (taskId, token) => {
        return axios.put(`${API_URL}/cancel/${taskId}`, null, { headers: { 'x-auth-token': token } });
    }
};

export default taskService;
