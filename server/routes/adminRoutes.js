// Defines routes for admin-only endpoints
const express=require("express")
const router=express.Router()
const adminController=require("../controllers/adminController")
const {verifyAuthToken}=require("../middlewares/authMiddleware")
const {VerifyAdmin}=require("../middlewares/adminMiddleware")
router.use(verifyAuthToken,VerifyAdmin)

router.get("/document",adminController.fetchProposedDocuments)
router.get("/fix",adminController.fetchProposedFixes)
router.get("/document/:id",adminController.fetchProposedDocumentDetails)
router.get("/fix/:id",adminController.fetchProposedFixDetails)

module.exports=router