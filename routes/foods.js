const router = require('express').Router();
const { getFoods, getFood, addFood, updateFood, deleteFood, foodPhotoUpload } = require('../controllers/foods');

const Food = require('../models/Food');
const advancedResults = require('../middleware/advancedResults');

router.route('/:id/photo')
  .put(foodPhotoUpload)

router.route('/')
  .get(advancedResults(Food, 'reviews'), getFoods)
  .post(addFood)

router.route('/:id')
  .get(getFood)
  .put(updateFood)
  .delete(deleteFood)

module.exports = router;