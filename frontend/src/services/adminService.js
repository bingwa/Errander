// frontend/src/services/adminService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

const getPendingErranders = (token) => {
    return axios.get(`${API_URL}/pending-erranders`, {
        headers: { 'x-auth-token': token },
    });
};

const approveErrander = (id, token) => {
    return axios.put(`${API_URL}/approve-errander/${id}`, null, {
        headers: { 'x-auth-token': token },
    });
};

const denyErrander = (id, token) => {
    return axios.delete(`${API_URL}/deny-errander/${id}`, {
        headers: { 'x-auth-token': token },
    });
};

const adminService = {
    getPendingErranders,
    approveErrander,
    denyErrander,
};

export default adminService;
