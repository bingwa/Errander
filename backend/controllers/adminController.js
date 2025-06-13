// backend/controllers/adminController.js
import Errander from '../models/Errander.js';
import User from '../models/User.js';

export const getPendingErranders = async (req, res) => {
    try {
        const pendingErranders = await Errander.find({ isVerified: false }).populate('user', ['email', 'phoneNumber']);
        res.json(pendingErranders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const approveErrander = async (req, res) => {
    try {
        const errander = await Errander.findByIdAndUpdate(
            req.params.id,
            { $set: { isVerified: true } },
            { new: true }
        );

        if (!errander) {
            return res.status(404).json({ msg: 'Errander profile not found' });
        }
        
        // Also update the core User model to reflect they are now a verified errander
        await User.findByIdAndUpdate(errander.user, { $set: { isErrander: true } });

        res.json({ msg: 'Errander approved successfully.', errander });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const denyErrander = async (req, res) => {
    try {
        const errander = await Errander.findById(req.params.id);

        if (!errander) {
            return res.status(404).json({ msg: 'Errander profile not found' });
        }

        // Here you might want to delete uploaded files from the server as well,
        // but for now we'll just remove the database record.
        
        await errander.deleteOne();

        res.json({ msg: 'Errander profile denied and removed.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
