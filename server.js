const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const db = require('./config/db');

// Load route files
const foods = require('./routes/foods');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// Load env variables
dotenv.config({ path: './config/.env' })

// Connect to database
db()

const app = express();
app.use(express.json());
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('dev'))
}

// Rate limit options
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
})

app.use(fileUpload()); // File uploading
app.use(mongoSanitize()); // Sanitize data
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent XSS attacks
app.use(limiter); // Rate limiting
app.use(hpp()); // Prevent HTTP param pollution
app.use(cors()); // Enabled CORS
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/foods', foods);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

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