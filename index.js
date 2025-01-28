require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const port = 4000

const mongoDB = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_SERVER + "/" + process.env.DB_NAME + "?retryWrites=true&w=majority&appName=fitness-app";

async function main() {
    await mongoose.connect(mongoDB);
    console.log("connected to db")
}
main().catch(err => console.log(err));

const Users = mongoose.model('Model', {}, 'users');

app.get('/', async (req, res) =>{
    const documents = await Users.create({ 'name': 'Álvaro' }); 
    res.send(documents);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})