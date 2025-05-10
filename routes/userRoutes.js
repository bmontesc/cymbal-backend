const express = require('express');
const router = express.Router();
const { getAthleteByStravaId, getCurrentUser, getAllUsers } = require('../controllers/userController');

// Route to get current authenticated user
router.get('/me', getCurrentUser);

// Route to get athlete by Strava ID
router.get('/:stravaId', getAthleteByStravaId);

// Route to get all users
router.get('/', getAllUsers);

module.exports = router;