const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: '*', // Allow all origins for dev and simple deployment
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic Health Check Route
app.get('/', (req, res) => {
  res.json({
    message: 'Complaint & Helpdesk Ticket System API is running',
    version: '1.0.0',
    status: 'online',
  });
});

// Mount Resource Routes under /api/
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// 404 Route Handler for undefined API paths
app.use((req, res, next) => {
  res.status(404).json({ message: `API route not found: ${req.originalUrl}` });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
