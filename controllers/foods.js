const Food = require('../models/Food');

/**
 * @desc    Get all foods
 * @route   GET /api/v1/foods
 * @access  Public
 */
exports.getFoods = async (req, res, next) => {
  try {
    const foods = await Food.find();

    res.status(200).json({ success: true, count: foods.length, data: foods })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

/**
 * @desc    Get single food
 * @route   GET /api/v1/foods/:id
 * @access  Public
 */
exports.getFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) return res.status(400).json({ success: false })

    res.status(200).json({ success: true, data: food })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

/**
 * @desc    Add new food
 * @route   POST /api/v1/foods/
 * @access  Private
 */
exports.addFood = async (req, res, next) => {
  try {
    const food = await Food.create(req.body);

    res.status(201).json({ success: true, data: food })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

/**
 * @desc    Updates a food
 * @route   PUT /api/v1/foods/:id
 * @access  Private
 */
exports.updateFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    if (!food) return res.status(400).json({ success: false })
  
    res.status(200).json({ success: true, data: food })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

/**
 * @desc    Deletes a food
 * @route   DELETE /api/v1/foods/:id
 * @access  Private
 */
exports.deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
  
    if (!food) return res.status(400).json({ success: false })
  
    res.status(200).json({ success: true, data: {} })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}