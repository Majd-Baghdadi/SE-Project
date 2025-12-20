// Handles admin operations: validating proposals/fixes, editing/deleting documents
const admin=require("../services/adminService")

//function to fetch all proposed documents
async function fetchProposedDocuments(req,res) {
    try {
        const {data,error}=await admin.fetchProposedDocuments(req.user)
        if (error) {
            return res.status(400).json({
                error:error.message
            })
        }
        res.status(200).json({
            documents:data
        })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                error:error.message
            })
        }
        res.status(500).json({
            error:error.message
        })
    }
}

//function to fetch all proposed fixes
async function fetchProposedFixes(req,res) {
    try {
        const {data,error}=await admin.fetchProposedFixes(req.user)
        if (error) {
            return res.status(400).json({
                error:error.message
            })
        }
        res.status(200).json({
            fixes:data
        })
    } catch (error) {
        if (error.statusCode) {
            return res.json(error.statusCode).json({
                error:error.message
            })
        }
        res.status(500).json({
            error:error.message
        })
    }
}

//function to fetch proposed document details
async function fetchProposedDocumentDetails(req,res) {
    try {
        const {id}=req.params
        const {data,error}=await admin.fetchProposedDocumentDetails(id,req.user)
        if (error) {
            return res.status(400).json({
                error:error.message
            })
        }
        res.status(200).json({
            document:data
        })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                error:error.message
            })
        }
        res.status(500).json({
            error:error.message
        })
    }
}

//function to fetch fix details
async function fetchProposedFixDetails(req,res) {
    try {
        const {id}=req.params
        const {data,error}=await admin.fetchProposedFixDetails(id,req.user)
        if (error) {
            return res.status(400).json({
                error:error.message
            })
        }
        res.status(200).json({
            fix:data
        })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                error:error.message
            })
        }
        res.status(500).json({
            error:error.message
        })
    }
}

module.exports={fetchProposedDocuments,fetchProposedDocumentDetails,fetchProposedFixes,fetchProposedFixDetails}