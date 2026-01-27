// Defines routes for admin-only endpoints
const express=require("express")
const router=express.Router()
const adminController=require("../controllers/adminController")
const {verifyAuthToken}=require("../middlewares/authMiddleware")
const {VerifyAdmin}=require("../middlewares/adminMiddleware")
const { upload } = require("../middlewares/uploadMiddleware")
router.use(verifyAuthToken,VerifyAdmin)

router.get("/proposedDocuments", adminController.fetchProposedDocuments)
router.get("/proposedFixes", adminController.fetchProposedFixes)
router.patch("/updateDocument/:docid", upload.single('docpicture'), adminController.updateDocument)
router.post("/validateProposition/:propositionId", adminController.validateProposition)
router.patch("/validateFix/:fixId", adminController.validateFix)
module.exports=router