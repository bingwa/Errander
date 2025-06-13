import axios from 'axios';
const API_URL = `${process.env.REACT_APP_API_URL}/chat`;

const chatService = {
    getChatHistory: (taskId, token) => {
        return axios.get(`${API_URL}/${taskId}`, { headers: { 'x-auth-token': token } });
    }
};

export default chatService;
