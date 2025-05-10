const User = require('../models/user.model');

// Authentication middleware
const authenticate = async (req, res, next) => {
    try {
        // Check if user is provided in request body
        const userData = req.body.user;
        
        if (!userData || !userData._id) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Set the user in the request
        req.user = userData;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = {
    authenticate
};