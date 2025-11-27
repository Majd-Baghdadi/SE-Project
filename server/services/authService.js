// Business logic for authentication: signup, login, token generation

const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs/dist/bcrypt");
const { generateVerificationToken } = require("../utils/generateToken");
const sendEmail = require('../utils/sendEmail');


const userExists = async (email) => {

    const { data: existing } = await supabase.from('users').select('email').eq('email', email).single();

    return existing != null;
};

const createUser = async (userName, email, password, role, verified) => {
    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const { data, error } = await supabase.from('users').insert([{
        name: userName, email: email, password: hashedpassword, role: role, verified: verified
    }]).select().single();

    if (error) {
        throw error;
    }

    const { password: _, ...userWithoutPassword } = data;
    return userWithoutPassword;


}


const validateUser = async (userId) => {
    const { data, error } = await supabase
        .from('users')
        .update({ verified: true })
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        throw error;
    }

    const { password, ...userWithoutPassword } = data;
    return userWithoutPassword;
}

const removeUser = async (userId) => {
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

    if (error) {
        throw error;
    }

    console.log('User deleted:', userId);
    return true;
}


const sendVerificationEmail = async (user) => {

    const token = generateVerificationToken(user.id);

    const url = `${process.env.FRONTEND_URL}/verify.html?token=${token}`

    await sendEmail(
        user.email,
        'Verify Your Email Address',
        `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Email Verification</h1>
            </div>
            <div class="content">
                <h2>Hello ${user.name},</h2>
                <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
                <a href="${url}" class="button">Verify Email</a>
                <p>Or copy and paste this link into your browser:</p>
                <p>${url}</p>
                <p>This link will expire in 24 hours.</p>
            </div>
            <div class="footer">
                <p>If you didn't create an account, please ignore this email.</p>
            </div>
        </div>
    </body>
    </html>
    `
    );

}



const findUser = async (email) => {

    const { data, error } = await supabase.from('users')
        .select('id,email,password,verified').eq('email', email,)
        .maybeSingle();    
    
    if(error) throw error ;

    return data;

}



module.exports = { userExists, createUser, sendVerificationEmail, validateUser, removeUser, findUser };



