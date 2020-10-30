const asyncHandler = require('../middleware/async');
const Food = require('../models/Food');
const Review = require('../models/Review');
const User = require('../models/User');
const Order = require('../models/Order');
const Cart = require('../models/cart');

/**
 * @desc    Loads home page
 * @route   GET /
 * @access  Public
 */
exports.home = asyncHandler(async (req, res, next) => {
  const user = JSON.parse(JSON.stringify(req.user)),
    foods = await Food.find({}).limit(4).lean(),
    reviews = await Review.find({}).sort('-rating').limit(3).populate({
      path: 'user',
      select: 'name'
    }).lean();
  
  res.render('home', { 
    title: 'Home', user, foods, reviews,
    cartCount: new Cart(req.cookies.cart && JSON.parse(req.cookies.cart)).count() || 0
  })
})

/**
 * @desc    Loads cart page
 * @route   GET /cart
 * @access  Public
 */
exports.cart = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!req.cookies.cart) {
    return res.render('cart', {
      title: 'Shopping Cart', user, cartItems: null
    })
  }
  const cart = new Cart(JSON.parse(req.cookies.cart));

  res.render('cart', {
    title: 'Shopping Cart', user, cartCount: cart.count() || 0,
    cartItems: cart.basket, totalPrice: cart.total().toLocaleString()
  });
})


/**
 * @desc    Checks cart out and completes order
 * @route   POST /checkout
 * @access  Private
 */
exports.checkout = async (req, res, next) => {
  if (!req.cookies.cart) {
    req.flash('errorMessage', `Your cart is empty ❌`);
    res.redirect('/cart');
  }

  const cart = new Cart(JSON.parse(req.cookies.cart));

  if (req.body.cashTendered < cart.total()) {
    req.flash('errorMessage', `Your cash should be greater than or equal to ₦${cart.total().toLocaleString()} 🙄`);
    res.redirect('/cart');
  } else {
    req.body.user = req.user._id;
    req.body.orderId = `#MS-${idGenerator()}`;
    req.body.foodItems = cart.basket;
    req.body.totalPrice = cart.total();

    await Order.create(req.body)

    res.cookie('cart', 'none', {
      expires: new Date(Date.now()),
      httpOnly: true
    })
    req.flash('successMessage', 'Your imaginary food is on its way😏! Enjoy🎉');
    res.redirect('/dashboard/orders');
  }
}


/**
 * @desc    Gets all foods
 * @route   GET /foods
 * @access  Public
 */
exports.getFoods = asyncHandler(async (req, res, next) => {
  const user = JSON.parse(JSON.stringify(req.user)),
        foods = await Food.find({ quantity: { $gt: 0 } }).lean()
  
  res.render('foods', {
    title: 'All Foods', user, foods,
    cartCount: new Cart(req.cookies.cart && JSON.parse(req.cookies.cart)).count() || 0
  })
})


/**
 * @desc    Gets food by slug
 * @route   GET /food/:slug
 * @access  Public
 */
exports.getFood = asyncHandler(async (req, res, next) => {
  const user = JSON.parse(JSON.stringify(req.user)),
        food = await Food.findOne({ slug: req.params.slug }).lean()

  if (!food) res.redirect('/foods')

  const reviews = await Review.find({ food: food._id }).populate({
    path: 'user',
    select: '_id name'
  }).lean();

  let hasReviewed = [];
  if (req.user)
    hasReviewed = await Review.find({ food: food._id, user: req.user._id }).lean();

  res.render('food', {
    title: food.name, user, food, reviews, reviewCount: reviews.length, hasReviewed: hasReviewed.pop(),
    cartCount: new Cart(req.cookies.cart && JSON.parse(req.cookies.cart)).count() || 0
  })
})


/**
 * @desc    Loads login page
 * @route   GET && POST /login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  if (req.user) return res.redirect('/dashboard');

  const title = 'Log In';
  if (req.method === 'POST') {
    const errors = [];
    const { email, password } = req.body;

    if (!email || !password) {
      errors.push({ message: 'Please enter an email address & a password' })
      return res.render('login', { title, errors, email, password })
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      errors.push({ message: 'Invalid credentials' })
      return res.render('login', { title, errors, email, password })
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      errors.push({ message: 'Invalid credentials' })
      return res.render('login', { title, errors, email, password })
    }

    sendCookieToken(user, 'dashboard', res)
  } else {
    res.render('login', { title })
  }
})

/**
 * @desc    Clears user token & logs user out
 * @route   GET /logout
 * @access  Public
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now()),
    httpOnly: true
  })
  req.flash('successMessage', `You've logged out ✅`);
  res.redirect('/');
})

/**
 * @desc    Loads register page
 * @route   GET && POST /register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  if (req.user) return res.redirect('/dashboard');

  const errors = [];
  const { name, email, password } = req.body;
  if (req.method === 'POST') {
    if (password && password.length < 6) {
      errors.push({ message: 'Password is less than six characters!' })
    }

    if (errors.length) {
      res.render('register', { title: 'Register', errors, name, email, password })
    } else {
      const oldUser = await User.findOne({ email })

      if (oldUser) {
        errors.push({ message: 'Email address has been taken :(' })
        return res.render('register', { title: 'Register', errors, name, email, password })
      }

      const user = await User.create({ ...req.body });
      req.flash('successMessage', `Hi ${user.name.split(' ').shift()}! Welcome to your dashboard🤩!`);
      sendCookieToken(user, 'dashboard', res)
    }
  } else {
    res.render('register', { title: 'Register' })
  }
})

/**
 * @desc    Loads dashboard page (for logged in users only)
 * @route   GET /dashboard
 * @access  Public
 */
exports.dashboard = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    req.flash('errorMessage', 'You are not logged in ⛔');
    res.redirect('/login');
  }

  const user = JSON.parse(JSON.stringify(req.user)),
        url = req.url.split('/').pop(),
        foods = req.user.role === 'admin' && await Food.find({}).lean(),
        users = req.user.role === 'admin' && await User.find({}).lean(),
        reviews = req.user.role === 'admin' ? await Review.find({}).lean() : await Review.find({ user: req.user._id }).lean(),
        orders = req.user.role === 'admin' 
          ? await Order.find({}).populate({ path: 'user', select: 'name' }).lean()
          : await Order.find({ user: req.user._id }).lean();

  let select, title;

  switch (url) {
    case 'users':
      select = 'users', title = 'Dashboard / Users';
      break;
    case 'foods':
      select = 'foods', title = 'Dashboard / Foods';
      break;
    case 'orders':
      select = 'orders', title = 'Dashboard / My Orders';
      break;
    case 'reviews':
      select = 'reviews', title = 'Dashboard / Reviews';
      break;
    default:
      select = 'account', title = 'Dashboard';
      break;
  }
  res.render('dashboard', {
    title: title.split(' / ').pop().toString(),
    foods, select, user, users, reviews, orders,
    breadcrumb: title.split(' / ').filter(e => e !== 'Dashboard').toString(),
    cartCount: new Cart(req.cookies.cart && JSON.parse(req.cookies.cart)).count() || 0
  })
})

/**
 * @desc    Adds a food
 * @route   POST /dashboard/foods/:id
 * @access  Private [Admin]
 */
exports.addFood = asyncHandler(async (req, res, next) => {
  try {
    await Food.create(req.body);

    req.flash('successMessage', 'Food created successfully 🍕!');
    res.redirect('/dashboard/foods');
  } catch (error) {
    req.flash('errorMessage', 'An error occured. Please check your input & retry :(');
    res.redirect('/dashboard/foods');
  }
})

/**
 * @desc    Updates a food
 * @route   PUT /dashboard/foods/:id
 * @access  Private [Admin]
 */
exports.updateFood = asyncHandler(async (req, res, next) => {
  await Food.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true
  });

  req.flash('successMessage', 'Food updated successfully 🦄!');
  res.redirect('/dashboard/foods');
})

/**
 * @desc    Deletes a food
 * @route   DELETE /dashboard/foods/:id
 * @access  Public
 */
exports.deleteFood = asyncHandler(async (req, res, next) => {
  await Food.findByIdAndDelete(req.params.id);

  req.flash('errorMessage', 'Food deleted successfully 🚮!');
  res.redirect('/dashboard/foods');
})

/**
 * @desc    Updates a user
 * @route   PUT /dashboard/users/:id
 * @access  Private
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
  if (req.body._option === 'userDetails') {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email
    }
  
    const oldUser = await User.findOne({ email: req.body.email }).lean();

    if (oldUser && oldUser.email !== req.user.email) {
      req.flash('errorMessage', `An account exists with that email address ❌`);
      res.redirect('/dashboard');
    } else {
      await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
        new: true,
        runValidators: true
      });
    
      req.flash('successMessage', 'Details updated successfully ⭐!');
      res.redirect('/dashboard');
    }
  } else if (req.body._option === 'userPassword') {
    const user =  await User.findById(req.user._id).select('+password');
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Check current password
    if (!(await user.comparePassword(currentPassword))) {
      req.flash('errorMessage', 'Password is incorrect ❌');
      res.redirect('/dashboard');
    } else if (newPassword !== confirmNewPassword) {
      req.flash('errorMessage', `New password & confirmed password don't match ⛔`);
      res.redirect('/dashboard');
    } else {
      user.password = req.body.newPassword;
      await user.save();

      req.flash('successMessage', 'Password updated successfully 🔐!');
      res.redirect('/dashboard');
    }
  } else {
    req.flash('errorMessage', `An unnecessary error occured 💀`);
    res.redirect('/dashboard');
  }
})


/**
 * @desc    Create user
 * @route   POST /api/v1/users
 * @access  Private/Admin
 */
// exports.createUser = asyncHandler(async (req, res, next) => {
//   const user = await User.create(req.body);
  
//   res.status(201).json({ success: true, data: user });
// })


/**
 * @desc    Delete user
 * @route   DELETE /api/v1/users/:id
 * @access  Private/Admin
 */
// exports.deleteUser = asyncHandler(async (req, res, next) => {
//   await User.findByIdAndDelete(req.params.id);
  
//   res.status(200).json({ success: true, data: {} });
// })


/**
 * @desc    Add review
 * @route   POST /food/:slug/:foodId/reviews
 * @access  Private
 */
exports.addReview = asyncHandler(async (req, res, next) => {
  let food = await Food.findOne({ slug: req.params.slug }).lean()

  if (!food) {
    req.flash('errorMessage', 'An error occured. Please retry :(');
    res.redirect('/foods');
  }

  req.body.food = req.params.foodId;
  req.body.user = req.user.id;

  food = await Food.findById(req.params.foodId);
  if (!food) {
    req.flash('errorMessage', 'An error occured. Please retry :(');
    res.redirect(`/food/${req.params.slug}`);
  }

  try {
    await Review.create(req.body)

    req.flash('successMessage', 'Review added successfully 🦄!');
    res.redirect(`/food/${req.params.slug}`);
  } catch (error) {
    req.flash('errorMessage', 'An error occured. Please check your inputs & retry :(');
    res.redirect(`/food/${req.params.slug}`);
  }
})


/**
 * @desc    Updates a user's review
 * @route   PUT /dashboard/reviews/:id
 * @access  Private
 */
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    req.flash('errorMessage', 'Unknown review 🛑');
    res.redirect('/dashboard/reviews');
  }

  // Make sure review belongs to user or user is admin
  //** For some reason, after a successful update the error message still shows up
  //** Probably some fuzzy logic. I need some sleep😴
  if (review.user.toString() !== req.user._id || req.user.role !== 'admin') {
    req.flash('errorMessage', 'Not authorized to update review ⛔');
    res.redirect('/dashboard/reviews');
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  review.save();

  req.flash('successMessage', 'Review updated successfully 🦄!');
  res.redirect('/dashboard/reviews');
})


/**
 * @desc    Error page
 * @route   GET *
 * @access  Public
 */
// exports.notFound = asyncHandler(async (req, res, next) => {
//   res.render('notFound', {
//     title: 'Oops! Page Not Found :(',
//     url: req.url
//   })
// })

// Helper function for sending encrypted token cookie
const sendCookieToken = (user, url, res) => {
  // Create token
  const token = user.getSignedToken();
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') options.secure = true
  res.cookie('token', token, options).redirect(`/${url}`);
}

// Order ID generator function
const idGenerator = () => {
  const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  return (S4()+S4())
}