import axios from 'axios';
const API_URL = `http://localhost:5000/api/chat`;

const chatService = {
    getChatHistory: (taskId, token) => {
        return axios.get(`${API_URL}/${taskId}`, { headers: { 'x-auth-token': token } });
    }
};

export default chatService;
