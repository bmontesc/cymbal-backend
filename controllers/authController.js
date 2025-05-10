const User = require('../models/user.model');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = `http://localhost:${process.env.PORT}/auth/callback`;

// Controller for initiating Strava OAuth
const initiateStravaAuth = (req, res) => {
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=read,activity:read`;
    res.redirect(authUrl);
};

// Controller for handling Strava OAuth callback
const handleStravaCallback = async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
        return res.status(400).json({ error: 'No authorization code received' });
    }

    try {
        // Exchange code for tokens
        const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code'
            })
        });

        const tokens = await tokenResponse.json();

        if (tokens.errors) {
            throw new Error(JSON.stringify(tokens.errors));
        }

        // Get athlete data
        const athleteResponse = await fetch('https://www.strava.com/api/v3/athlete', {
            headers: {
                'Authorization': `Bearer ${tokens.access_token}`
            }
        });

        const athlete = await athleteResponse.json();

        // Create or update user in database
        const userData = {
            refresh_token: tokens.refresh_token,
            strava_id: athlete.id,
            firstname: athlete.firstname,
            lastname: athlete.lastname,
            sex: athlete.sex,
            city: athlete.city,
            premium: athlete.premium,
            profile: athlete.profile
        };

        const user = await User.findOneAndUpdate(
            { strava_id: athlete.id },
            userData,
            { upsert: true, new: true }
        );

        res.json({
            message: 'Authentication successful',
            user: user
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    initiateStravaAuth,
    handleStravaCallback
};