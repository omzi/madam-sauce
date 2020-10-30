const mongoose = require('mongoose');

const connectToDatabase = async () => {
  const { connection } = await mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.MONGO_PROD_URI : process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })

  if (process.env.NODE_ENV !== 'production') {
    const colors = require('colors');
    console.log(`✬ | Mongoose connected successfully to ${connection.host}`.cyan.bold)
  }
}

module.exports = connectToDatabase;