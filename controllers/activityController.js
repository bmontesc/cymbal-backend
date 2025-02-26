const User = require('../models/user.model');
const Activity = require('../models/activity.model');

// Function to get activities since a specific date
const getActivitiesSinceDate = async (accessToken, sinceDate) => {
    try {
        // Convert date to epoch timestamp for Strava API
        const after = Math.floor(new Date(sinceDate).getTime() / 1000);
        
        const activitiesResponse = await fetch(
            `https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=200`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        const activities = await activitiesResponse.json();

        if (activitiesResponse.status !== 200) {
            throw new Error(activities.message || 'Failed to fetch activities');
        }

        // Filter only running activities
        return activities.filter(activity => 
            activity.sport_type === "Run"
        );
    } catch (error) {
        throw new Error(`Failed to fetch activities: ${error.message}`);
    }
};

// Controller to sync activities for the logged-in athlete
const syncAthleteActivities = async (req, res) => {
    const user = req.user;

    try {
        // Find the most recent activity for this user
        const latestActivity = await Activity.findOne({ user: user._id })
            .sort({ start_date: -1 });

        // Set the sync start date
        const syncFromDate = latestActivity 
            ? latestActivity.start_date 
            : new Date('2024-12-01T00:00:00Z');

        // Fetch activities from Strava
        const stravaActivities = await getActivitiesSinceDate(req.stravaAccessToken, syncFromDate);

        // Process and save activities to our database
        const activities = await Promise.all(stravaActivities.map(async (stravaActivity) => {
            // Map Strava activity to our schema
            const activityData = {
                user: user._id,
                strava_athlete_id: stravaActivity.athlete.id,
                strava_id: stravaActivity.id,
                name: stravaActivity.name,
                type: stravaActivity.type,
                sport_type: stravaActivity.sport_type,
                workout_type: stravaActivity.workout_type,
                distance: stravaActivity.distance,
                moving_time: stravaActivity.moving_time,
                elapsed_time: stravaActivity.elapsed_time,
                total_elevation_gain: stravaActivity.total_elevation_gain,
                start_date: stravaActivity.start_date,
                location: {
                    city: stravaActivity.location_city,
                    state: stravaActivity.location_state,
                    country: stravaActivity.location_country
                },
                map: {
                    strava_id: stravaActivity.map.id,
                    summary_polyline: stravaActivity.map.summary_polyline,
                    resource_state: stravaActivity.map.resource_state
                },
                average_speed: stravaActivity.average_speed,
                max_speed: stravaActivity.max_speed,
                has_heartrate: stravaActivity.has_heartrate,
                average_heartrate: stravaActivity.average_heartrate,
                max_heartrate: stravaActivity.max_heartrate
            };

            // Use findOneAndUpdate to update existing activities or create new ones
            const activity = await Activity.findOneAndUpdate(
                { strava_id: stravaActivity.id },
                activityData,
                { upsert: true, new: true }
            );

            return activity;
        }));

        res.json({
            message: `Successfully synced ${activities.length} activities`,
            syncedFrom: syncFromDate,
            activities
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Controller to get stored activities from our database
const getStoredActivities = async (req, res) => {
    const { page = 1, per_page = 30 } = req.query;
    const user = req.user;

    try {
        const activities = await Activity.find()
            .sort({ start_date: -1 })
            .skip((page - 1) * per_page)
            .limit(parseInt(per_page));

        const total = await Activity.countDocuments();

        res.json({
            activities,
            page: parseInt(page),
            per_page: parseInt(per_page),
            total
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    syncAthleteActivities,
    getStoredActivities
};