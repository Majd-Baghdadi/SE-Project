// Business logic for handling propositions
const supabase= require("../config/supabase");
const { NotFoundError, ForbiddenError } = require("../errors/appErros");

//add a document (called by admins)

async function addDocument(payload,user) {
    if (user.role!=="admin") {
        throw new ForbiddenError("you are not an admin")
    }
    return await supabase.from("documents").insert(payload).select()
    
}

//propose a document (called by users)

async function proposeDocument(payload) {
    return await supabase.from("proposed_documents").insert(payload).select()
}

//propose a fix only for normal users

async function proposeFix(payload) {
    return await supabase.from("fixes").insert(payload).select()
}

//edit a proposed document
async function updateProposedDocument(id,payload,user) {
    console.log(id) 
    const {data,error}=await supabase.from("proposed_documents").select("userid").eq("proposeddocid",id).single()
    if (!data || error) {
        throw new NotFoundError("Document not found")
    }
    if (user.role!=="admin" && user.userId!==data.userid) {
        throw new ForbiddenError("Access denied")
    }
    return await supabase.from("proposed_documents").update(payload).eq("proposeddocid",id).select().single()
}

//edit a proposed fix
async function updateProposedFix(id,payload,user) {
    const {data,error}=await supabase.from("fixes").select("userid").eq("fixid",id).single()
    if (!data || error) {
        throw new NotFoundError("Fix not found")
    }
    if (user.role!=="admin" && user.userId!==data.userid) {
        throw new ForbiddenError("Access denied")
    }
    return await supabase.from("fixes").update(payload).eq("fixid",id).select().single()
}

//get all documents proposed by a user

async function fetchProposedDocumentsByUser(id) {
    return await supabase.from("proposed_documents").select("*").eq("userid",id)
}

//get all fixes proposed by a user

async function fetchProposedFixesByUser(id) {
    return await supabase.from("fixes").select("*").eq("userid",id)
}

module.exports={
    addDocument,
    proposeDocument,
    proposeFix,
    updateProposedDocument,
    updateProposedFix,
    fetchProposedDocumentsByUser,
    fetchProposedFixesByUser
}