const User = require('../models/user.model');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// Middleware to validate and refresh Strava access token
const validateStravaToken = async (req, res, next) => {
    try {
        console.log("validateStravaToken")
        console.log(req.user)

        const user = req.user;
        if (!user || !user.refresh_token) {
            return res.status(401).json({ error: 'User not authenticated with Strava' });
        }

        // Request new access token using refresh token
        const response = await fetch('https://www.strava.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token: user.refresh_token,
                grant_type: 'refresh_token'
            })
        });

        const data = await response.json();
        
        if (data.errors) {
            throw new Error(JSON.stringify(data.errors));
        }

        // Update user's refresh token in database
        await User.findOneAndUpdate(
            { strava_id: user.strava_id },
            { refresh_token: data.refresh_token }
        );

        // Add the access token to the request object
        req.stravaAccessToken = data.access_token;
        next();
    } catch (error) {
        console.error('Error refreshing access token:', error);
        res.status(401).json({ error: 'Failed to refresh access token' });
    }
};

module.exports = {
    validateStravaToken
};