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
    return await supabase.from("proposed_documents").select("proposeddocid,docname,docpicture").eq("userid",id)
}

//get all fixes proposed by a user

async function fetchProposedFixesByUser(id) {
    return await supabase.from("fixes").select("fixid,documents!inter (docname)").eq("userid",id)
}

//delete a proposed document
async function deleteProposedDocuemnt(id,user) {
    const {data,error}=await supabase.from("proposed_documents").select("userid").eq("proposeddocid",id).single()
    if (!data || error) {
        throw new NotFoundError("Proposed document not found")
    }
    if (data.userid!==user.userId && user.role!=="admin") {
        throw new ForbiddenError("Access denied")
    }
    return await supabase.from("proposed_documents").delete().eq("proposeddocid",id).select()
    
}

//delete a proposed fix
async function deleteProposedFix(id,user) {
    const {data,error}=await supabase.from("fix").select("userid").eq("fixid",id).single()
    if (!data || error) {
        throw new NotFoundError("Proposed fix not found")
    }
    if (data.userid!==user.userId || user.role!=="admin") {
        throw new ForbiddenError("Access denied")
    }
    return await supabase.from("fix").delete().eq("fixid",id).select()
}

//function to fetch proposed document details
async function fetchProposedDocumentDetails(id,user) {
    const{data,error}= await supabase.from("proposed_documents").select("userid").eq("proposeddocid",id).single()
    if (!data || error) {
        throw new NotFoundError("no proposed document with this id")
    }
    if (user.role!=="admin" && user.userId!==data.userid) {
        throw new ForbiddenError("Access denied")
    }
    
    return await supabase.from("proposed_documents").select("*").eq("proposeddocid",id)
}

//function to fetch proposed fix details
async function fetchProposedFixDetails(id,user) {
    const {data,error}= await supabase.from("fixes").select("userid").eq("fixid",id).single()
    if (!data || error) {
        throw new NotFoundError("no proposed document with this id")
    }
    if (user.role!=="admin" && user.userId!==data.userid) {
        throw new ForbiddenError("Access denied")
    }
    return await supabase.from("fixes").select("*").eq("fixid",id)
}

module.exports={
    addDocument,
    proposeDocument,
    proposeFix,
    updateProposedDocument,
    updateProposedFix,
    fetchProposedDocumentsByUser,
    fetchProposedFixesByUser,
    deleteProposedDocuemnt,
    deleteProposedFix,
    fetchProposedDocumentDetails,
    fetchProposedFixDetails
}