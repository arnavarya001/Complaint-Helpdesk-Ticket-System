const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send("hello world");
});

app.get(['/api', '/api/'], (req, res) => {
  res.send("api working");
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.use((req, res, next) => {
  res.status(404).json({ message: `API route not found: ${req.originalUrl}` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
