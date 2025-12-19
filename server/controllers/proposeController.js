// Handles fix/issue reporting for documents
const propose=require("../services/proposeService")


//function to call when proposing a document

async function proposeDocument(req,res) {
    try {
        const role=req.user.role
        let call
        var payload={
            ...req.body,
        }
        if (role==="admin") {
            call= await propose.addDocument(payload)
        }
        else{
            payload={
                ...payload,
                userid:req.user.userId
            }
            call= await propose.proposeDocument(payload)
        }
        const {data,error}=call
        if (error) {
            return res.status(400).json({
                error:error.message
            })
        }
        res.status(201).json({
            document:data
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

//function to call when proposing a fix

async function proposeFix(req,res) {
    try {
        const {docid}=req.params
        console.log(docid)
        const payload={
            ...req.body,
            docid:docid,
            userid:req.user.userId
        }
        const {data,error}= await propose.proposeFix(payload)
        if (error) {
            return res.status(400).json({
                error:error.message
            })
        }
        res.status(201).json({
            fix:data
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

//function to call when editing a document proposition

async function editProposedDocument(req,res) {
    try {
        const {id}=req.params
        console.log(id)
        const {data,error}=await propose.updateProposedDocument(id,req.body,req.user)
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

//function to call when updating a fix proposition

async function editProposedFix(req,res) {
    try {
        const {id}=req.params
        const payload={
            ...req.body,
        }
        const {data,error}=await propose.updateProposedFix(id,payload,req.user)
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

//function to call when fetching all proposed documents by a user

async function getProposedDocumentsByUser(req,res) {
    try {
        const {data,error}=await propose.fetchProposedDocumentsByUser(req.user.userId)
        if (error) {
            return res.status(400).json({
                error:error.message
            })
        }
        res.status(200).json({
            documents:data
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

//function to call to fetch all proposed fixes by a user

async function getProposedFixesByUser(req,res) {

    try {
        const {data,error}=await propose.fetchProposedFixesByUser(req.user.userId)
        if (error) {
            return res.status(400).json({
                error:error.message
            })
        }
        res.status(200).json({
            fixes:data
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}


module.exports={
    proposeDocument,
    proposeFix,
    editProposedDocument,
    editProposedFix,
    getProposedDocumentsByUser,
    getProposedFixesByUser,
}