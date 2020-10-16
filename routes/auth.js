const router = require('express').Router();
const { register, login, currentUser, forgotPassword, resetPassword, updateDetails, updatePassword } = require('../controllers/auth');

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, currentUser);
router.put('/updateDetails', protect, updateDetails);
router.put('/updatePassword', protect, updatePassword);
router.post('/reset', forgotPassword);
router.put('/reset/:resetToken', resetPassword);

module.exports = router;