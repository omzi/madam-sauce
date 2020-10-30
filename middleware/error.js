const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (error, req, res, next) => {
  // Log to console for dev
  if (process.env.NODE_ENV !== 'production') {
    console.log(`✖ | Error: ${error.name}`.red.bold)
    console.log(`Details: ${error.stack}`.red)
  }

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    error = new ErrorResponse(`Resource not found :(`, 404);
  }

  // Mongoose duplicate key error
  if (error.name === 'MongoError' && error.code === 11000) {
    error = new ErrorResponse('Duplicate field value entered', 400)
  }

  // Mongoose vaildation error
  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map(value => value.message);
    error = new ErrorResponse(message.join(', '), 400)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  })
}

module.exports = errorHandler;