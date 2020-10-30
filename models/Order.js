const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  foodItems: {
    type: [{
      itemId: mongoose.Schema.ObjectId,
      itemName: String,
      quantity: Number,
      price: Number
    }],
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  cashTendered: {
    type: Number,
    required: [true, 'Please add the cash tendered']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please enter the total cost of the food']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);