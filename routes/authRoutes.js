const express = require('express');
const router = express.Router();
const { initiateStravaAuth, handleStravaCallback } = require('../controllers/authController');

// Route to initiate Strava OAuth
router.get('/strava', initiateStravaAuth);

// Route to handle Strava OAuth callback
router.get('/callback', handleStravaCallback);

module.exports = router;