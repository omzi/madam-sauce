const router = require('express').Router();
const { getFoods, getFood, addFood, updateFood, deleteFood, foodPhotoUpload } = require('../controllers/foods');

router.route('/:id/photo')
  .put(foodPhotoUpload)

router.route('/')
  .get(getFoods)
  .post(addFood)

router.route('/:id')
  .get(getFood)
  .put(updateFood)
  .delete(deleteFood)

module.exports = router;