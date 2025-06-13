// backend/middleware/adminMiddleware.js
import authMiddleware from './authMiddleware.js';

const adminMiddleware = (req, res, next) => {
    // First, run the standard authentication middleware
    authMiddleware(req, res, () => {
        // Then, check if the authenticated user is an admin
        if (req.user && req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
        }
    });
};

export default adminMiddleware;
