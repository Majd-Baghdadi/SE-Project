// Defines routes for admin-only endpoints
const express=require("express")
const router=express.Router()
const adminController=require("../controllers/adminController")
const {verifyAuthToken}=require("../middlewares/authMiddleware")
const {VerifyAdmin}=require("../middlewares/adminMiddleware")
router.use(verifyAuthToken,VerifyAdmin)

router.get("/proposedDocuments",adminController.fetchProposedDocuments)
router.get("/proposedFixes",adminController.fetchProposedFixes)

module.exports=router