const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({ name, email, password, role });

  sendTokenCookieResponse(user, 200, res)
})

/**
 * @desc    Log user in
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please enter an email address & a password'))
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new ErrorResponse('Invalid credentials'), 401);

  // Check if password matches
  const isMatch = await user.comparePassword(password);

  if (!isMatch) return next(new ErrorResponse('Invalid credentials'), 401);

  sendTokenCookieResponse(user, 200, res)
})

/**
 * @desc    Get current logged in user
 * @route   POST /api/v1/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user =  await User.findById(req.user._id);

  res.status(200).json({ success: true, data: user });
})

const sendTokenCookieResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') options.secure = true

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
}