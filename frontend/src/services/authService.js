// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = `http://localhost:5000/api/auth`;

const register = (email, password, phoneNumber) => {
    return axios.post(`${API_URL}/register`, {
        email,
        password,
        phoneNumber,
    });
};

const login = (email, password) => {
    return axios.post(`${API_URL}/login`, {
        email,
        password,
    });
};

const verifyOtp = (userId, otp) => {
    return axios.post(`${API_URL}/verify-otp`, {
        userId,
        otp,
    });
};

const authService = {
    register,
    login,
    verifyOtp,
};

export default authService;
