// Defines routes for user profile and data endpoints
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyAuthToken } = require('../middlewares/authMiddleware');

router.get('/profile', verifyAuthToken, userController.getProfile);

module.exports = router;