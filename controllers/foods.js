const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Food = require('../models/Food');

/**
 * @desc    Get all foods
 * @route   GET /api/v1/foods
 * @access  Public
 */
exports.getFoods = asyncHandler(async (req, res, next) => {
    const reqQuery = { ...req.query };

    // Fields to exclude from results
    const removeFields = ['select', 'sort', 'page', 'limit']

    // Loop over removeFields & delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    let queryString = JSON.stringify(reqQuery);
    // Create Mongoose operators ($gt, $lt, etc.)
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    let query = Food.find(JSON.parse(queryString));

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ')
      query = query.select(fields);
    }

    // Sort Fields
    if (req.query.sort) {
      const fields = req.query.sort.split(',').join(' ')
      query = query.sort(fields);
    } else {
      query = query.sort('-name');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Food.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const foods = await query;

    // Pagination result
    const pagination = {}

    if (endIndex < total) {
      pagination.next = { page: page + 1, limit }
    }

    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit }
    }

    res.status(200).json({ success: true, count: foods.length, pagination, data: foods })
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