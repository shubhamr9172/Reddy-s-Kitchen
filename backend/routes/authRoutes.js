const express = require('express');
const { requestOTP, verifyOTP, verifyMojoToken, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);
router.post('/verify-mojo', verifyMojoToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
