const router = require('express').Router();
const { getFoods, getFood, addFood, updateFood, deleteFood } = require('../controllers/foods');

router.route('/')
  .get(getFoods)
  .post(addFood)

router.route('/:id')
  .get(getFood)
  .put(updateFood)
  .delete(deleteFood)

module.exports = router;