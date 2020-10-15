const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Food = require('../models/Food');

/**
 * @desc    Get all foods
 * @route   GET /api/v1/foods
 * @access  Public
 */
exports.getFoods = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  
    if (!food) return next(new ErrorResponse(`Food not found with id #${req.params.id}`, 404))
  
    res.status(200).json({ success: true, data: {} })
})

/**
 * @desc    Upload photo for food
 * @route   PUT /api/v1/foods/:id/photo
 * @access  Private
 */
exports.foodPhotoUpload = asyncHandler(async (req, res, next) => {
  const food = await Food.findById(req.params.id);

  if (!food) return next(new ErrorResponse(`Food not found with id #${req.params.id}`, 404))

  if (!req.files) return next(new ErrorResponse('Please upload a file', 400))

  const file = req.files.file;

  // Check file mimetype
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400))
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(new ErrorResponse(`Please upload an image less than or equal to ${process.env.MAX_FILE_SIZE}`, 400))
  }

  // Create custom filename
  file.name = `${food.slug}-${food._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) return next(new ErrorResponse('An error occured during file upload', 500))

    await Food.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({ success: true, data: file.name });
  })
})