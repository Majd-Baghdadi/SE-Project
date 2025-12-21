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

//function to fetch all proposed fixes main infos 
async function fetchProposedFixes(user) {
    console.log("here")
    if (user.role!=="admin") {
        throw new ForbiddenError("you are not an admin")
    }
    return await supabase.from("fixes").select(`fixid,documents!inner (docname),users!inner (name)`)
    
}





module.exports={fetchProposedDocuments,fetchProposedFixes,}