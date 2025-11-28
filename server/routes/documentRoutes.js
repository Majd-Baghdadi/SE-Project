// Defines routes for document-related endpoints
const express=require("express")
const router=express.Router();
const documentController=require("../controllers/documentController")

router.get("/",documentController.getDocuments);
router.get("/:id",documentController.getDocumentDetails);


module.exports=router