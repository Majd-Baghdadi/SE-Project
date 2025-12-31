// Business logic and database interactions for official documents (CRUD operations)
const supabase=require("../config/supabase");

async function getDocuments() {
    return await supabase.from("documents").select("docid,docname,docpicture,doctype,created_at,duration");
}
async function getDocumentDetails(id) {
    return await supabase.from("documents").select("*").eq("docid",id).single();
}

async function getRelatedDocuments(ids) {
    return await supabase.from("documents").select("docid,docname").in("docid",ids);
}




module.exports={getDocuments,getDocumentDetails,getRelatedDocuments}