require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mongoDB = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_SERVER + "/" + process.env.DB_NAME + "?retryWrites=true&w=majority";
async function main() {
    await mongoose.connect(mongoDB);
    console.log("connected to db")
}
main().catch(err => console.log(err));
const app = express()
const port = 3000

const Comments = mongoose.model('Model', {}, 'comments');

app.get('/', async (req, res) => {
    try {
        const documents = await Comments.find({ name: "Alliser Thorne" });
        res.send(documents);
    } catch (err) {
        console.error("Error retrieving comments:", err);
        res.status(500).send("Error retrieving comments");
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
