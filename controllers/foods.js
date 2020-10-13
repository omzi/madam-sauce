/**
 * @desc    Get all foods
 * @route   GET /api/v1/foods
 * @access  Public
 */
exports.getFoods = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Shows all foods' })
}

/**
 * @desc    Get single food
 * @route   GET /api/v1/foods/:id
 * @access  Public
 */
exports.getFood = (req, res, next) => {
  res.status(200).json({ success: true, message: `Shows food ${req.params.id}` })
}

/**
 * @desc    Add new food
 * @route   POST /api/v1/foods/
 * @access  Private
 */
exports.addFood = (req, res, next) => {
  res.status(201).json({ success: true, message: 'Adds new food' })
}

/**
 * @desc    Updates a food
 * @route   PUT /api/v1/foods/:id
 * @access  Private
 */
exports.updateFood = (req, res, next) => {
  res.status(200).json({ success: true, message: `Updates food ${req.params.id}` })
}

/**
 * @desc    Deletes a food
 * @route   DELETE /api/v1/foods/:id
 * @access  Private
 */
exports.deleteFood = (req, res, next) => {
  res.status(200).json({ success: true, message: `Deletes food ${req.params.id}` })
}