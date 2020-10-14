const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Food = require('../models/Food');

/**
 * @desc    Get all foods
 * @route   GET /api/v1/foods
 * @access  Public
 */
exports.getFoods = asyncHandler(async (req, res, next) => {
    const foods = await Food.find();

    res.status(200).json({ success: true, count: foods.length, data: foods })
})

/**
 * @desc    Get single food
 * @route   GET /api/v1/foods/:id
 * @access  Public
 */
exports.getFood = asyncHandler(async (req, res, next) => {
    const food = await Food.findById(req.params.id);

    if (!food) return next(new ErrorResponse(`Food not found with id #${req.params.id}`, 404))

    res.status(200).json({ success: true, data: food })
})

/**
 * @desc    Add new food
 * @route   POST /api/v1/foods/
 * @access  Private
 */
exports.addFood = asyncHandler(async (req, res, next) => {
    const food = await Food.create(req.body);

    res.status(201).json({ success: true, data: food })
})

/**
 * @desc    Updates a food
 * @route   PUT /api/v1/foods/:id
 * @access  Private
 */
exports.updateFood = asyncHandler(async (req, res, next) => {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
  
    if (!food) return next(new ErrorResponse(`Food not found with id #${req.params.id}`, 404))
  
    res.status(200).json({ success: true, data: food })
})

/**
 * @desc    Deletes a food
 * @route   DELETE /api/v1/foods/:id
 * @access  Private
 */
exports.deleteFood = asyncHandler(async (req, res, next) => {
    const food = await Food.findByIdAndDelete(req.params.id);
  
    if (!food) return next(error)
  
    res.status(200).json({ success: true, data: {} })
})