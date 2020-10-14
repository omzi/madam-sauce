const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const db = require('./config/db');

// Load route files
const foods = require('./routes/foods');

dotenv.config({ path: './config/.env' })

// Connect to database
db()

const app = express();
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// Mount routers
app.use('/api/v1/foods', foods);

const PORT = process.env.PORT || 5050

const server = app.listen(PORT, () => {
  console.log(':>>'.green.bold, `Server running in ${process.env.NODE_ENV} mode on port`.yellow.bold, `${PORT}`.blue.bold)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.log(`✖ | Error: ${err.message}`.red.bold)
  server.close(() => process.exit(1))
})