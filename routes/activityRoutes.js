const express = require('express');
const router = express.Router();
const { syncAthleteActivities, getStoredActivities } = require('../controllers/activityController');
const { validateStravaToken } = require('../middleware/stravaAuth');
const { authenticate } = require('../middleware/auth');

// Route to sync running activities from Strava
router.post('/sync', validateStravaToken, syncAthleteActivities);

// Route to get stored running activities from our database
router.get('/', getStoredActivities);

module.exports = router;