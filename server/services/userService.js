// Business logic for user profiles and contributions
const supabase = require("../config/supabase");

const getProfileById = async (userId) => {
    const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, verified, proposecontribution, fixcontribution')
        .eq('id', userId)
        .maybeSingle();

    if (error) {
        console.error('Failed to fetch user profile:', error);
        throw new Error('Failed to fetch user profile');
    }

    return data;
};

const updateProfile = async (newName,userId)=>{
    console.log(userId)
    const {data,error}=await supabase.from('users').update({name:newName}).eq('id',userId).select().maybeSingle();

    if(error){
        console.error('Failed to update user profile', error);
        throw new Error('Failed to update user profile ');
    }
    console.log(data);
    return data;
}

module.exports = { getProfileById ,updateProfile};