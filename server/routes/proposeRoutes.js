// Defines routes for propose endpoints
const express=require("express")
const router=express.Router()
const proposeController=require("../controllers/proposeController")
const {verifyAuthToken}=require("../middlewares/authMiddleware")
const {VerifyUser}=require("../middlewares/userMiddleware")
const { upload } = require("../middlewares/uploadMiddleware")

router.use(verifyAuthToken)

router.post("/document", upload.single('docpicture'), proposeController.proposeDocument) //route to propose a document
router.post("/fix/:docid", VerifyUser, upload.single('docpicture'), proposeController.proposeFix) //route to propose a fix (user only)
router.patch("/document/:id", upload.single('docpicture'), proposeController.editProposedDocument) //route to edit a proposed document
router.patch("/fix/:id", proposeController.editProposedFix) //route to edit a proposed fix
router.get("/document", VerifyUser, proposeController.getProposedDocumentsByUser) //route to fetch documents proposed by a user
router.get("/fix", VerifyUser, proposeController.getProposedFixesByUser) //route to fetch fixes proposed by a user
router.delete("/document/:id", proposeController.deleteProposedDocuemnt) //route to delete a proposed document
router.delete("/fix/:id", proposeController.deleteProposedFix) //route to delete a proposed fix
router.get("/proposedDocument/:id", proposeController.fetchProposedDocumentDetails) //fetch a proposed document's details
router.get("/proposedFix/:id", proposeController.fetchProposedFixDetails) //fetch a proposed fix details

module.exports=router