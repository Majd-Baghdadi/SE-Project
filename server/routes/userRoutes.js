// Defines routes for user profile and data endpoints
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyAuthToken } = require('../middlewares/authMiddleware');
const { userLimiter } = require('../middlewares/rateLimiter');

router.get('/profile', verifyAuthToken,userLimiter,userController.getProfile);
router.patch('/updateProfile',verifyAuthToken,userLimiter,userController.updateProfile) ;
router.get("/",userController.getUsersCount)


module.exports = router;