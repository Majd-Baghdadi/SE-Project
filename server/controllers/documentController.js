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
            return res.status(404).json({
                error:error.message,
            })
        }
        const {relateddocs,...documentData}=data
        console.log('📌 Related docs from DB:', relateddocs, 'Type:', typeof relateddocs);
        
        // Handle relateddocs whether it's an array or null/undefined
        const relatedDocsArray = Array.isArray(relateddocs) ? relateddocs : [];
        console.log('📌 Related docs array:', relatedDocsArray, 'Length:', relatedDocsArray.length);
        
        const {data:relatedDocs,error:err}=await Document.getRelatedDocuments(relatedDocsArray)
        console.log('📌 Related docs fetched:', relatedDocs, 'Length:', relatedDocs?.length);
        
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