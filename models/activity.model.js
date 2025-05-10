const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    // MongoDB reference to our user
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Strava athlete ID for reference
    strava_athlete_id: {
        type: Number,
        required: true
    },

    // Strava activity ID
    strava_id: {
        type: Number,
        required: true,
        unique: true
    },

    // Basic activity info
    name: {
        type: String,
        required: true
    },
    type: String,
    sport_type: String,
    workout_type: Number,

    // Metrics
    distance: {
        type: Number,
        required: true
    },
    moving_time: {
        type: Number,
        required: true
    },
    elapsed_time: {
        type: Number,
        required: true
    },
    total_elevation_gain: {
        type: Number,
        default: 0
    },

    // Timing
    start_date: {
        type: Date,
        required: true
    },

    // Location
    location: {
        city: String,
        state: String,
        country: String
    },

    // Map data
    map: {
        strava_id: String,
        summary_polyline: String,
        resource_state: Number
    },

    // Speed data
    average_speed: Number,
    max_speed: Number,

    // Heart rate data
    has_heartrate: Boolean,
    average_heartrate: Number,
    max_heartrate: Number
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Index for efficient queries
ActivitySchema.index({ user: 1, start_date: -1 });
ActivitySchema.index({ strava_id: 1 });
ActivitySchema.index({ strava_athlete_id: 1 });

// Virtual for formatted distance in kilometers
ActivitySchema.virtual('distanceInKm').get(function() {
    return (this.distance / 1000).toFixed(2);
});

// Virtual for formatted moving time in hours and minutes
ActivitySchema.virtual('formattedMovingTime').get(function() {
    const hours = Math.floor(this.moving_time / 3600);
    const minutes = Math.floor((this.moving_time % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});

const Activity = mongoose.model('activities', ActivitySchema);

module.exports = Activity;