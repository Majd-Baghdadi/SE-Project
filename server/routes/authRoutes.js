// Defines routes for authentication endpoints
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyAuthToken } = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/verifyEmail', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/resendVerificationEmail', authController.resendVerificationEmail);
router.get('/me', verifyAuthToken, authController.isLoggedIn);
router.post('/sendResetEmail', authController.sendResetEmail);
router.post('/resetPassword', authController.resetPassword);

module.exports = router;