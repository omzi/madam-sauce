const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Food = require('../models/Food');
const Review = require('../models/Review');

/**
 * @desc    Get reviews
 * @route   GET /api/v1/reviews
 * @route   GET /api/v1/foods/:foodId/reviews
 * @access  Public
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.foodId) {
    const reviews = await Review.find({ food: req.params.foodId });

    return res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
})

/**
 * @desc    Get single review
 * @route   GET /api/v1/reviews/:id
 * @access  Public
 */
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'food',
    select: 'name description'
  });

  if (!review) return next(new ErrorResponse(`No review found with the id of #${req.params.id}`, 404));

  res.status(200).json({ success: true, data: review });
})

/**
 * @desc    Add review
 * @route   POST /api/v1/foods/:foodId/reviews
 * @access  Private
 */
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.food = req.params.foodId;
  req.body.user = req.user.id;

  const food = await Food.findById(req.params.foodId);
  if (!food) return next(new ErrorResponse(`No food found with id of #${req.params.foodId}`, 404))

  const review = await Review.create(req.body)

  res.status(201).json({ success: true, data: review });
})

/**
 * @desc    Update review
 * @route   POST /api/v1/reviews/:id
 * @access  Private
 */
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) return next(new ErrorResponse(`No review found with id of #${req.params.id}`, 404))

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update review', 401))
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  review.save();

  res.status(201).json({ success: true, data: review });
})

/**
 * @desc    Delete review
 * @route   DELETE /api/v1/reviews/:id
 * @access  Private
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new ErrorResponse(`No review found with id of #${req.params.id}`, 404))

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete review', 401))
  }

  await review.remove();

  res.status(201).json({ success: true, data: {} });
})