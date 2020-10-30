const mongoose = require('mongoose');

const connectToDatabase = async () => {
  const { connection } = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })

  console.log(`✬ | Mongoose connected successfully to ${connection.host}`.cyan.bold)
}

module.exports = connectToDatabase;