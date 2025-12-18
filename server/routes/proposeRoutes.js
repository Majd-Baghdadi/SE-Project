// Defines routes for propose endpoints
const express=require("express")
const router=express.Router()
const proposeController=require("../controllers/proposeController")
const authCheck=require("../middlewares/authMiddleware")
const userCheck=require("../middlewares/userMiddleware")
router.apply(authCheck)

router.post("/document",proposeController.proposeDocument) //route to propose a document
router.post("/:docid/fix",userCheck,proposeController.proposeFix) //route to propose a fix (user only)
router.patch("/document:id",proposeController.editProposedDocument) //route to edit a proposed document
router.patch(":docid/fix:id",proposeController.editProposedFix) //route to edit a proposed fix
router.get("/document",proposeController.getProposedDocumentsByUser) //route to fetch documents proposed by a user
router.get("/fix",proposeController.getProposedFixesByUser) //route to fetch fixes proposed by a user

module.exports=router