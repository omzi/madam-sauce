const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

// Load route files
const foods = require('./routes/foods');

dotenv.config()
const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// Mount routers
app.use('/api/v1/foods', foods);

const PORT = process.env.PORT || 5050

app.listen(PORT, () => {
  console.log(':>>'.green.bold, `Server running in ${process.env.NODE_ENV} mode on port`.yellow.bold, `${PORT}`.blue.bold)
})