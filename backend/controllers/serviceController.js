// backend/controllers/serviceController.js
import Service from '../models/Service.js';

export const getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
