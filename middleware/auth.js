const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token = '';

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[+!!{}];
  } 
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure cookie exists
  if (!token) return next(new ErrorResponse('Not authorized to access this route'), 401);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route'), 401);
  }
})

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`User role '${req.user.role}' is unauthorised to access this route`), 403);
    }
    next();
  }
}