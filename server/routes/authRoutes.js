// Defines routes for authentication endpoints
const express=require('express') ;
const router=express.Router() ;
const authController=require('../controllers/authController') ;

router.post('/register',authController.register);
router.post('/verifyEmail',authController.verifyEmail) ;
router.post('/login',authController.login);
module.exports=router ;