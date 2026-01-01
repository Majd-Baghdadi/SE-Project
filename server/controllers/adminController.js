// Handles admin operations: validating proposals/fixes, editing/deleting documents
const admin = require("../services/adminService")
const proposeService = require("../services/proposeService")
const storageService = require("../services/storageService")
const { proposeDocument } = require("./proposeController")
//function to fetch all proposed documents
async function fetchProposedDocuments(req, res) {
    try {
        const { data, error } = await admin.fetchProposedDocuments(req.user)
        if (error) {
            return res.status(400).json({
                error: error.message
            })
        }
        res.status(200).json({
            documents: data
        })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                error: error.message
            })
        }
        res.status(500).json({
            error: error.message
        })
    }
}

//function to fetch all proposed fixes
async function fetchProposedFixes(req, res) {
    try {
        const { data, error } = await admin.fetchProposedFixes(req.user)
        if (error) {
            return res.status(400).json({
                error: error.message
            })
        }
        res.status(200).json({
            fixes: data
        })
    } catch (error) {
        if (error.statusCode) {
            return res.json(error.statusCode).json({
                error: error.message
            })
        }
        res.status(500).json({
            error: error.message
        })
    }
}


const updateDocument = async (req, res) => {

    try {
        const { docid } = req.params;

        if (!docid) {
            return res.status(400).json({
                success: false,
                error: 'document id is required'
            });
        }

        const { docpicture, ...bodyWithoutPicture } = req.body;
        
        // Only include known database columns to avoid errors
        var payload = {};
        
        // Copy only valid fields
        if (bodyWithoutPicture.docname) payload.docname = bodyWithoutPicture.docname;
        if (bodyWithoutPicture.doctype) payload.doctype = bodyWithoutPicture.doctype;
        if (bodyWithoutPicture.duration) payload.duration = bodyWithoutPicture.duration;
        if (bodyWithoutPicture.docprice !== undefined) payload.docprice = parseInt(bodyWithoutPicture.docprice) || 0;
        
        // Handle steps
        if (bodyWithoutPicture.steps) {
            if (typeof bodyWithoutPicture.steps === 'string') {
                try {
                    payload.steps = JSON.parse(bodyWithoutPicture.steps);
                } catch (e) {
                    return res.status(400).json({
                        success: false,
                        error: 'steps must be a valid JSON array'
                    });
                }
            } else {
                payload.steps = bodyWithoutPicture.steps;
            }
        }
        
        // Handle relateddocs
        if (bodyWithoutPicture.relateddocs) {
            if (typeof bodyWithoutPicture.relateddocs === 'string') {
                try {
                    payload.relateddocs = JSON.parse(bodyWithoutPicture.relateddocs);
                } catch (e) {
                    payload.relateddocs = [];
                }
            } else {
                payload.relateddocs = bodyWithoutPicture.relateddocs;
            }
        }
        
        // Handle requirements (if column exists in DB)
        if (bodyWithoutPicture.requirements) {
            if (typeof bodyWithoutPicture.requirements === 'string') {
                try {
                    payload.requirements = JSON.parse(bodyWithoutPicture.requirements);
                } catch (e) {
                    payload.requirements = [];
                }
            } else {
                payload.requirements = bodyWithoutPicture.requirements;
            }
        }
        
        // Handle tips (if column exists in DB)
        if (bodyWithoutPicture.tips) {
            if (typeof bodyWithoutPicture.tips === 'string') {
                try {
                    payload.tips = JSON.parse(bodyWithoutPicture.tips);
                } catch (e) {
                    payload.tips = [];
                }
            } else {
                payload.tips = bodyWithoutPicture.tips;
            }
        }

        if (!payload.docname || !payload.doctype || !payload.steps || payload.steps.length == 0) {
            return res.status(400).json({
                success: false,
                error: 'document name , type , and steps are required '
            });
        }

        if (req.file) {
            console.log("uploading the image");
            const url = await storageService.uploadImage(req.file);
            payload.docpicture = url;
        }

        console.log('📝 Update document payload:', JSON.stringify(payload, null, 2));
        console.log('📝 Document ID:', docid);

        const document = await admin.updateDocument(payload, docid)


        res.status(200).json({
            success: true,
            document,
            message: "Document updated successfully"
        })

    } catch (error) {
        console.error('❌ Error in updating document:', error.message);
        console.error('❌ Full error:', error);
        res.status(500).json(
            {
                success: false,
                error: error.message || "failed to update the document"
            }
        )

    }



}


const validateProposition = async (req, res) => {

    try {
        const { propositionId } = req.params;
        if (!propositionId) {
            return res.status(400).json({
                success: false,
                error: 'proposition id  is required'
            });
        }

        const proposedDocument = await admin.getProposedDocumnet(propositionId);
        if (!proposedDocument) {
            return res.status(404).json({
                success: false,
                error: 'proposed document does not exist'
            });
        }
        const document = {
            docname: proposedDocument.docname,
            docpicture: proposedDocument.docpicture,
            doctype: proposedDocument.doctype,
            steps: proposedDocument.steps,
            relateddocs: proposedDocument.relateddocs,
            docprice: proposedDocument.docprice,
            duration: proposedDocument.duration,

        }
        const userId = proposedDocument.userid;
        console.log(userId);
        const { data, error } = await proposeService.addDocument(document, req.user);

        if (error) {
            console.error('Database error :', error);
            throw new Error('Database error occured');
        }

        // add it to contributions 
        await admin.addContribution(userId, propositionId, "propose")

        // delete the proposed document after validation
        await admin.deleteProposedDocuemnt(propositionId)

        res.status(200).json({
            success: true,
            document: data,
            message: "Document validated successfully"
        });




    } catch (error) {
        console.error(error);
        res.status(500).json(
            {
                success: false,
                error: "failed to validate proposed document"
            }
        )

    }


}


const validateFix = async (req, res) => {
    try {
        const { fixId } = req.params;

        if (!fixId) {
            return res.status(400).json({
                success: false,
                error: 'fix id is required'
            });
        }

        const payload = {
            ...req.body,
        }

        if (!payload.docname || !payload.doctype || !payload.steps || payload.steps.length == 0) {
            return res.status(400).json({
                success: false,
                error: 'document name, type, and steps are required'
            });
        }



        const fix = await admin.getFix(fixId);
        if (!fix) {
            return res.status(404).json({
                success: false,
                error: 'fix does not exist'
            });
        }

        const { docid, userid } = fix;
        const document = await admin.updateDocument(payload, docid);

        // add it to contributions
        await admin.addContribution(userid, fixId, "fix")

        // delete the fix after validation
        await admin.deleteFix(fixId)

        res.status(200).json({
            success: true,
            document,
            message: "fix validated successfully"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json(
            {
                success: false,
                error: "failed to validate fix"
            }
        )

    }

}




module.exports = { fetchProposedDocuments, fetchProposedFixes, updateDocument, validateProposition, validateFix }