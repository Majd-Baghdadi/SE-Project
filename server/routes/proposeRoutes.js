// Defines routes for propose endpoints
const express=require("express")
const router=express.Router()
const proposeController=require("../controllers/proposeController")
const {verifyAuthToken}=require("../middlewares/authMiddleware")
const {VerifyUser}=require("../middlewares/userMiddleware")

router.use(verifyAuthToken)

router.post("/document",proposeController.proposeDocument) //route to propose a document
router.post("/fix/:docid",VerifyUser,proposeController.proposeFix) //route to propose a fix (user only)
router.patch("/document/:id",proposeController.editProposedDocument) //route to edit a proposed document
router.patch("/fix/:id",proposeController.editProposedFix) //route to edit a proposed fix
router.get("/document",proposeController.getProposedDocumentsByUser) //route to fetch documents proposed by a user
router.get("/fix",proposeController.getProposedFixesByUser) //route to fetch fixes proposed by a user

module.exports=router