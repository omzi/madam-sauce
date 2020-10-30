const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const User = require('../models/User');

exports.isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.flash('errorMessage', 'Not authorised ❌');
    res.redirect('/login');
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    req.flash('errorMessage', 'Not authorised ❌');
    res.redirect('/login');
  }
}

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      req.flash('errorMessage', 'Not authorised ❌');
      res.redirect('/login');
    }
    next();
  }
}

exports.currentUser = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch (error) {
    req.user = null
  }
  next();
}