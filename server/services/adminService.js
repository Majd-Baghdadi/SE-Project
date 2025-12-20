// Business logic for handling admin actions
const supabase=require("../config/supabase")
const { ForbiddenError, NotFoundError } = require("../errors/appErros")

//function to fetch all the proposed documents main infos
async function fetchProposedDocuments(user) {
    if (user.role!=="admin") {
        throw new ForbiddenError("you are not an admin")
    }
    return await supabase.from("proposed_documents").select("proposeddocid,docname,docpicture")
}

//function to fetch all proposed fixes main infos (still don't know what infos to fetch :>)
async function fetchProposedFixes(user) {
    if (user.role!=="admin") {
        throw new ForbiddenError("you are not an admin")
    }
    return await supabase.from("fixes").select("fixid,docname,docpicture")
}

//function to fetch proposed document details
async function fetchProposedDocumentDetails(id,user) {
    if (user.role!=="admin") {
        throw new ForbiddenError("you are not an admin")
    }
    const{data,error}= await supabase.from("proposed_documents").select("*").eq("proposeddocid",id).single()
    if (!data) {
        throw new NotFoundError("no proposed document with this id")
    }
    return {data,error}
}

//function to fetch proposed fix details
async function fetchProposedFixDetails(id,user) {
    if (user.role!=="admin") {
        throw new ForbiddenError("you are not an admin")
    }
    const {data,error}= await supabase.from("fixes").select("*").eq("fixid",id).single()
    if (!data) {
        throw new NotFoundError("no proposed document with this id")
    }
    return {data,error}
}



module.exports={fetchProposedDocuments,fetchProposedDocumentDetails,fetchProposedFixes,fetchProposedFixDetails}