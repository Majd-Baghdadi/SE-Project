// Business logic for handling admin actions
const supabase = require("../config/supabase")
const { ForbiddenError, NotFoundError } = require("../errors/appErros")

//function to fetch all the proposed documents main infos
async function fetchProposedDocuments(user) {
    if (user.role !== "admin") {
        throw new ForbiddenError("you are not an admin")
    }
    return await supabase.from("proposed_documents").select(`proposeddocid,docname,docpicture, users!inner (name,email)`)
}

//function to fetch all proposed fixes main infos 
async function fetchProposedFixes(user) {
    console.log("here")
    if (user.role !== "admin") {
        throw new ForbiddenError("you are not an admin")
    }
    return await supabase.from("fixes").select(`fixid, creation_date,documents!inner (docname),users!inner (name,email)`)

}


async function updateDocument(payload, docid) {
    const { data, error } = await supabase.from('documents').update(payload).eq('docid', docid).select().maybeSingle();

    if (error) {
        console.error('Failed to update document:', error);
        throw new Error("Failed to update document");
    }

    if (!data) {
        throw new NotFoundError("Document not found");
    }

    return data;
}


async function getProposedDocumnet(id) {
    const { data, error } = await supabase.from('proposed_documents').select('*').eq('proposeddocid', id).maybeSingle();

    if (error) {
        console.error('Failed to fetch proposed document:', error);
        throw new Error('Failed to fetch proposed document');
    }

    return data; // Returns null if not found, controller handles the check
}

async function getFix(id) {
    const { data, error } = await supabase.from('fixes').select('docid,userid').eq('fixid', id).maybeSingle();

    if (error) {
        console.error('Failed to fetch fix:', error);
        throw new Error('Failed to fetch fix');
    }

    return data; // Returns null if not found, controller handles the check
}


async function deleteProposedDocuemnt(id) {

    const { error } = await supabase.from("proposed_documents").delete().eq("proposeddocid", id);

    if (error) {
        console.error('Failed to delete proposed document:', error);
        throw new Error("Failed to delete proposed document");
    }

}


async function deleteFix(id) {

    const { error } = await supabase.from("fixes").delete().eq("fixid", id);

    if (error) {
        console.error('Failed to delete fix:', error);
        throw new Error("Failed to delete fix");
    }

} 

async function addContribution(userId, id, type) {
    const column = type === "propose" ? "proposecontribution" : "fixcontribution";

    const { data, error: fetchError } = await supabase
        .from('users')
        .select(column)
        .eq('id', userId)
        .single();

    if (fetchError) {
        console.error('Failed to fetch user contributions:', fetchError);
        throw new Error("Failed to fetch user contributions");
    }

    // 2. Append the new ID
    const updatedArray = [...(data[column] || []), id];

    // 3. Update the array in the database
    const { error: updateError } = await supabase
        .from('users')
        .update({ [column]: updatedArray })
        .eq('id', userId);

    if (updateError) {
        console.error('Failed to update user contributions:', updateError);
        throw new Error("Failed to update user contributions");
    }

}


module.exports = { fetchProposedDocuments, fetchProposedFixes, updateDocument, getProposedDocumnet, deleteProposedDocuemnt, getFix, deleteFix, addContribution }