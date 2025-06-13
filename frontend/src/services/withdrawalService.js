import axios from 'axios';
const API_URL = `${process.env.REACT_APP_API_URL}/withdraw`;
const withdrawalService = { requestWithdrawal: (data, token) => axios.post(API_URL, data, { headers: { 'x-auth-token': token } }) };
export default withdrawalService;
