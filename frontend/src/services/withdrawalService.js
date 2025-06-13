import axios from 'axios';
const API_URL = 'http://localhost:5000/api/withdraw';
const withdrawalService = { requestWithdrawal: (data, token) => axios.post(API_URL, data, { headers: { 'x-auth-token': token } }) };
export default withdrawalService;
