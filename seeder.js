const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config({ path: './config/.env' })

// Load models
const Food = require('./models/Food');
const User = require('./models/User');
const Review = require('./models/Review');

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})

// Read JSON files
const foods = JSON.parse(fs.readFileSync(`${__dirname}/.data/foods.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/.data/users.json`, 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/.data/reviews.json`, 'utf-8'))

// Import into database
const importData = async () => {
  try {
    await Food.create(foods);
    await User.create(users);
    await Review.create(reviews);

    console.log(' ↓ | Data imported... '.black.bgGreen.bold.inverse);
    process.exit(1)
  } catch (error) {
    console.log(`✖ | Error: ${error}`.red.bold)
  }
}

// Delete from database
const deleteData = async () => {
  try {
    await Food.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log(' ↶ | Data destroyed... '.black.bgRed.bold.inverse);
    process.exit(1)
  } catch (error) {
    console.log(`✖ | Error: ${error}`.red.bold)
  }
}

switch (process.argv[2]) {
  case '-i':
    importData()
    break;
  case '-d':
    deleteData()
    break;
  default:
    console.log(' ☄ | Unknown flag. Possible flags are -i (import) & -d (destroy) '.blue.bold.inverse);
    process.exit(1)
}