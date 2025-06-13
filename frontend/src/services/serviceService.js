// frontend/src/services/serviceService.js
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/services`;

const getAllServices = () => {
    return axios.get(API_URL);
};

// THIS IS THE FIX: The function must be exported here.
const serviceService = {
    getAllServices,
};

export default serviceService;
