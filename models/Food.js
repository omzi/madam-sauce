const mongoose = require('mongoose');
const slugify = require('slugify');

const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add the name of the food'],
    unique: true,
    trim: true,
    maxlength: [100, 'Food name cannot be more than 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add the description of the food'],
    maxlength: [300, 'Food description cannot be more than 300 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please enter the price of the food']
  },
  quantity: {
    type: Number,
    required: [true, 'Please enter the quantity of the food']
  },
  categories: {
    type: [String],
    required: true,
    enum: [
      'beans', 'cassava', 'chicken', 'cocoyam', 
      'fish', 'plaintain', 'potato', 'rice',
      'salad', 'soup', 'stews', 'yam'
    ]
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be greater than or equal to 1'],
    max: [10, 'Rating must be less than or equal to 10']
  },
  photo: {
    type: String,
    default: 'placeholder.jpg'
  },
  available: {
    type: Boolean,
    default: true
  }
})

// Create food slug from the name
FoodSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true, remove: /[*+~\/\\.()'"!:@]/g })
  next();
})

module.exports = mongoose.model('Food', FoodSchema)