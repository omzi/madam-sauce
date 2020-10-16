const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const db = require('./config/db');

// Load route files
const foods = require('./routes/foods');
const auth = require('./routes/auth');
const users = require('./routes/users');

// Load env variables
dotenv.config({ path: './config/.env' })

// Connect to database
db()

const app = express();
app.use(express.json());
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/foods', foods);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

app.use(errorHandler);

const PORT = process.env.PORT || 5050

const server = app.listen(PORT, () => {
  console.log(':>>'.green.bold, `Server running in ${process.env.NODE_ENV} mode on port`.yellow.bold, `${PORT}`.blue.bold)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.log(`✖ | Error: ${err.message}`.red.bold)
  server.close(() => process.exit(1))
})