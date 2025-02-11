require('dotenv').config();
const express = require('express');
const app = express()

const mongoose = require('mongoose');

// Middleware to parse JSON bodies
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

const mongoDB = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_SERVER + "/" + process.env.DB_NAME + "?retryWrites=true&w=majority&appName=fitness-app";

async function main() {
    await mongoose.connect(mongoDB);
    console.log("connected to db")
}
main().catch(err => console.log(err));

const port = 3000


// Use auth routes for authentication
app.use('/auth', authRoutes);

// Use user routes for user management
app.use('/users', userRoutes);

// Use activity routes for activity management
app.use('/activities', activityRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
