// Handles document-related requests: retrieving, searching, and managing official documents
const Document=require("../services/documentService")

async function getDocuments(req,res) {
    try {
        const {data,error}= await Document.getDocuments();
        if (error){
            return res.status(400).json({
                error:error.message,
            })
        }
        res.status(200).json({
            documents:data,
        })
    } catch (error) {
        res.status(500).json({
            error:error.message,
        })
    }

}

async function getDocumentDetails(req,res) {
    const {id}=req.params;
    try {
        const {data,error}= await Document.getDocumentDetails(id);
        if (error) {
            res.status(404).json({
                error:error.message,
            })
        }
        const {relateddocs,...documentData}=data
        const {data:relatedDocs,error:err}=await Document.getRelatedDocuments(relateddocs||[])
        if (err) {
            return res.status(400).json({
                error:err.message,
            })
        }
        res.status(200).json({
            data:documentData,
            relatedDocuments:relatedDocs

        })
    } catch (error) {
        res.status(500).json({
            error:error.message,
        })
    }
    
}


module.exports={getDocuments,getDocumentDetails}