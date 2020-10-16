const express = require('express');
const { getReviews, getReview, addReview, updateReview, deleteReview } = require('../controllers/reviews');

const Review = require('../models/Review');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(advancedResults(Review, {
    path: 'food', select: 'name description'
  }), getReviews )
  .post(protect, authorize('admin', 'user'), addReview);

router.route('/:id')
  .get(getReview)
  .put(protect, authorize('admin', 'user'), updateReview)
  .delete(protect, authorize('admin', 'user'), deleteReview);

module.exports = router;