const router = require('express').Router();
const { getFoods, getFood, addFood, updateFood, deleteFood, foodPhotoUpload } = require('../controllers/foods');

const Food = require('../models/Food');
const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

router.route('/:id/photo')
  .put(protect, authorize('admin'), foodPhotoUpload)

router.route('/')
  .get(advancedResults(Food, 'reviews'), getFoods)
  .post(protect, authorize('admin'), addFood)

router.route('/:id')
  .get(getFood)
  .put(protect, authorize('admin'), updateFood)
  .delete(protect, authorize('admin'), deleteFood)

module.exports = router;