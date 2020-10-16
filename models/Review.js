const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100
  },
  content: {
    type: String,
    required: [true, 'Please add the review content']
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add a rating between 1 to 10']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  food: {
    type: mongoose.Schema.ObjectId,
    ref: 'Food',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

// Prevent user from submitting more than one review per food
ReviewSchema.index({ food: 1, user: 1 }, { unique: true });

// Static method to get the average rating & save
ReviewSchema.statics.getAverageRating = async function(foodId) {
  const obj = await this.aggregate([
    { $match: { food: foodId } },
    { 
      $group: {
        _id: '$food',
        averageRating: { $avg: '$rating' }
      }
    }
  ])

  try {
    await this.model('Food').findByIdAndUpdate(foodId, {
      averageRating: obj[+[]].averageRating.toFixed(2)
    })
  } catch (error) {
    console.log(error);
  }
}

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.food);
});

// Call getAverageRating after remove
ReviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.food);
});

module.exports = mongoose.model('Review', ReviewSchema);