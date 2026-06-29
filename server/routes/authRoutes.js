const express = require('express');
const { registerUser, loginUser, updateUserProfile, getUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').put(protect, updateUserProfile);
router.route('/users').get(protect, admin, getUsers);

module.exports = router;
