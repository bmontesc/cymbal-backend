// Initialize Mongoose Schema and Model for User
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    refresh_token: {
        type: String,
        required: true
    },
    strava_id: {
        type: Number,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
    },
    sex: {
        type: String,
        enum: ['M', 'F']
    },
    city: {
        type: String,
    },
    premium: {
        type: Boolean,
        required: true
    },
    profile: {
        type: String
    }
});

const User = mongoose.model('users', userSchema);

module.exports = User;