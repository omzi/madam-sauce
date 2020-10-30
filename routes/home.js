const router = require('express').Router();
const { isAuthenticated, authorize, currentUser } = require('../middleware/authHelpers');
const {
  home,
  cart,
  checkout,
  getFood,
  getFoods,
  addFood,
  updateFood,
  deleteFood,
  login,
  logout,
  register,
  dashboard,
  updateDetails,
  addReview,
  updateReview,
  notFound
} = require('../controllers/home');

router.use(currentUser);
// router.use(authorize('admin'));

router.route('/').get(home)
router.route('/food/:slug').get(getFood)
router.route('/foods').get(getFoods)
router.route('/cart').get(cart)
router.route('/checkout').post(isAuthenticated, checkout)

router.route('/dashboard').get(isAuthenticated, dashboard)
router.route('/dashboard/users').get(isAuthenticated, authorize('admin'), dashboard)
router.route('/dashboard/users/:id').put(isAuthenticated, updateDetails)

router.route('/dashboard/reviews').get(isAuthenticated, dashboard)
router.route('/food/:slug/:foodId/reviews').post(addReview)
router.route('/dashboard/reviews/:id').put(isAuthenticated, updateReview)

router.route('/dashboard/orders').get(isAuthenticated, dashboard)

router.route('/dashboard/foods').get(isAuthenticated, authorize('admin'), dashboard)
router.route('/dashboard/foods/:id').post(isAuthenticated, authorize('admin'), addFood)
router.route('/dashboard/foods/:id').put(isAuthenticated, authorize('admin'), updateFood)
router.route('/dashboard/foods/:id').delete(isAuthenticated, authorize('admin'), deleteFood)

router.route('/login').get(login).post(login)
router.route('/logout').get(logout)
router.route('/register').get(register).post(register)
// router.route('*').get(notFound)

module.exports = router;