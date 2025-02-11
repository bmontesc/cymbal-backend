const User = require('../models/user.model');

// Controller to get athlete by Strava ID
const getAthleteByStravaId = async (req, res) => {
    const { stravaId } = req.params;

    try {
        const user = await User.findOne({ strava_id: stravaId });
        
        if (!user) {
            return res.status(404).json({ error: 'Athlete not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Controller to get current user
const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;
        res.json(user);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAthleteByStravaId,
    getCurrentUser
};