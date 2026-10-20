// Centralized Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`Error: ${err.message}`);

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `A record with that ${field} already exists.`,
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      message: messages.join(', '),
    });
  }

  // Handle CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: `Resource not found with id ${err.value}`,
    });
  }

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
