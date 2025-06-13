// backend/controllers/erranderController.js
import Errander from '../models/Errander.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

export const createErranderProfile = async (req, res) => {
    const { firstName, lastName } = req.body;
    const userId = req.user.id;
    if (!req.files || !req.files.idDocument || !req.files.goodConductCertificate) { return res.status(400).json({ msg: 'Both documents are required.' }); }
    const idDocumentPath = req.files.idDocument[0].path;
    const goodConductCertificatePath = req.files.goodConductCertificate[0].path;
    try {
        if (await Errander.findOne({ user: userId })) { return res.status(400).json({ msg: 'Errander profile already exists.' }); }
        const erranderProfile = new Errander({ user: userId, firstName, lastName, idDocument: idDocumentPath, goodConductCertificate: goodConductCertificatePath });
        await erranderProfile.save();
        res.status(201).json({ msg: 'Profile submitted for review.', profile: erranderProfile });
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
};

export const updateErranderStatus = async (req, res) => {
    const { availabilityStatus, location } = req.body;
    const userId = req.user.id;
    try {
        const errander = await Errander.findOne({ user: userId });
        if (!errander) { return res.status(404).json({ msg: 'Errander profile not found' }); }
        if (availabilityStatus) { errander.availabilityStatus = availabilityStatus; }
        if (location && location.longitude && location.latitude) {
            errander.location = { type: 'Point', coordinates: [location.longitude, location.latitude] };
        }
        await errander.save();
        res.json(errander);
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
};

export const getDashboardSummary = async (req, res) => {
    try {
        const errander = await Errander.findOne({ user: req.user.id });
        if (!errander) { 
            return res.status(404).json({ msg: 'Errander profile not found' }); 
        }

        // FIX: Wallet balance should be calculated from 'paid' tasks, not 'completed' ones.
        const paidTasks = await Task.find({ 
            errander: errander._id,
            status: 'paid' 
        });
        const totalEarnings = paidTasks.reduce((acc, task) => acc + (task.finalPrice || task.estimatedPrice || 0), 0);
        
        // Use the most reliable source for these stats
        const jobsCompleted = errander.jobsCompleted;
        const averageRating = errander.currentRating;

        res.json({
            walletBalance: totalEarnings.toFixed(2),
            jobsCompleted,
            rating: averageRating.toFixed(1)
        });

    } catch (err) {
        console.error("--- ERROR in getDashboardSummary: ---", err.message);
        res.status(500).send('Server Error');
    }
};


export const findNearbyErranders = async (req, res) => {
    try {
        console.log("--- Backend Log: API endpoint /api/erranders/find-nearby was hit. ---");
        const availableErranders = await Errander.find({
            isVerified: true,
            availabilityStatus: 'available'
        });

        console.log(`--- Backend Log: Database query found ${availableErranders.length} errander(s) matching criteria. ---`);
        
        if (availableErranders.length > 0) {
            availableErranders.forEach(e => {
                console.log(`-> Details: Name=${e.firstName}, Verified=${e.isVerified}, Status=${e.availabilityStatus}, Location=${e.location ? e.location.coordinates : 'NOT SET'}`);
            });
        }

        res.json(availableErranders);
    } catch (err) {
        console.error("--- Backend Error in findNearbyErranders: ---", err.message);
        res.status(500).send('Server Error');
    }
};
