const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { tickets } = require('./data');

dotenv.config();
connectDB();

app.use(cors());
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send("hello world");
});

app.get(['/api', '/api/'], (req, res) => {
  res.send("api working");
});

app.get('/api/tickets', (req, res) => {
  res.json(tickets);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
