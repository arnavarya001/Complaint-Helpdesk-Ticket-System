const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
connectDB();

const { tickets } = require('./data');
const cors = require('cors');

app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("hello world");
});

app.get('/api', (req, res) => {
    res.send("api working");
});

app.get('/api/tickets', (req, res) => {
    res.json(tickets);
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
