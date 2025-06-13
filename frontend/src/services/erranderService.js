// frontend/src/services/erranderService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/erranders';

const createProfile = (formData, token) => {
    return axios.post(`${API_URL}/profile`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token,
        },
    });
};

const findNearby = (token) => {
    return axios.get(`${API_URL}/find-nearby`, {
        headers: { 'x-auth-token': token },
    });
};

const getDashboardSummary = (token) => {
    return axios.get(`${API_URL}/dashboard-summary`, {
        headers: { 'x-auth-token': token },
    });
};

// THIS IS THE FIX: All functions must be exported here.
const erranderService = {
    createProfile,
    findNearby,
    getDashboardSummary,
};

export default erranderService;
