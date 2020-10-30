const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const { formatDistanceToNow } = require('date-fns')
const dotenv = require('dotenv');
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
const home = require('./routes/home');
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
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Express session middleware
app.use(session({
  secret: 'secretsauce',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.successMessage = req.flash('successMessage');
  res.locals.errorMessage = req.flash('errorMessage');
  res.locals.error = req.flash('error');
  res.locals.session = req.session;
  next();
});

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
app.use('/api/', limiter); // API rate limiting
app.use(hpp()); // Prevent HTTP param pollution
app.use(cors()); // Enabled CORS
app.use(methodOverride('_method')); // Override HTTP methods

// Handlebars middleware
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: {
    ifEquals: function(arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },
    formatDate: value => {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      return new Intl.DateTimeFormat('en-US', options).format(value)
    },
    math: function(lvalue, operator, rvalue, options) {
      lvalue = parseFloat(lvalue);
      rvalue = parseFloat(rvalue);
          
      return {
          "+": lvalue + rvalue,
          "-": lvalue - rvalue,
          "*": lvalue * rvalue,
          "/": lvalue / rvalue,
          "%": lvalue % rvalue
      }[operator];
    },
    formatPrice: price => {
      return price.toLocaleString()
    },
    formatDateToNow: date => {
      return formatDistanceToNow(date, { addSuffix: true, includeSeconds: true })
    }
  }
}))
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
// Remove trailing slashes
app.use((req, res, next) => {
  if (req.path.substr(-1) == '/' && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    res.redirect(301, req.path.slice(0, -1) + query);
  } else {
    next();
  }
})

// Mount routers
app.use('/', home);
app.use('/api/v1/foods', foods);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5050

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    const colors = require('colors');
    console.log(':>>'.green.bold, `Server running in ${process.env.NODE_ENV} mode on port`.yellow.bold, `${PORT}`.blue.bold)
  }
})

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  if (process.env.NODE_ENV !== 'production') {
    const colors = require('colors');
    console.log(`✖ | Error: ${err.message}`.red.bold)
  }
  server.close(() => process.exit(1))
})