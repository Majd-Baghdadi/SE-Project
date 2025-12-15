// Business logic for authentication: signup, login, token generation

const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs/dist/bcrypt");
const { generateVerificationToken, generateResetToken } = require("../utils/generateToken");
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

const updatePassword = async (userId, newPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(newPassword, salt);

    const { data, error } = await supabase
        .from('users')
        .update({ password: hashedpassword })
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;

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

    const url = `${process.env.FRONTEND_URL}/verify?token=${token}`

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
                <p>This link will expire in 1 hours.</p>
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

const sendResetEmail = async (user) => {
    const token = generateResetToken(user.id);

    const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

    await sendEmail(
        user.email,
        'Reset Your Password',
        `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset</h1>
            </div>
            <div class="content">
                <h2>Hello ${user.name},</h2>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <a href="${url}" class="button">Reset Password</a>
                <p>Or copy and paste this link into your browser:</p>
                <p>${url}</p>
                <p>This link will expire in 1 hour.</p>
            </div>
            <div class="footer">
                <p>If you didn't request a password reset, please ignore this email.</p>
            </div>
        </div>
    </body>
    </html>
    `
    );

}



const findUser = async (email) => {

    const { data, error } = await supabase.from('users')
        .select('id, name, email, password, role, verified')
        .eq('email', email)
        .maybeSingle();

    if (error) throw error;

    return data;

}

// Find user by email for resending verification (without password)
const findUserByEmail = async (email) => {
    const { data, error } = await supabase.from('users')
        .select('id, name, email, verified')
        .eq('email', email)
        .maybeSingle();

    if (error) throw error;

    return data;
}

// Find user by ID (for isLoggedIn check)
const findUserById = async (userId) => {
    const { data, error } = await supabase.from('users')
        .select('id, name, email, role, verified')
        .eq('id', userId)
        .maybeSingle();

    if (error) throw error;

    return data;
}


module.exports = { updatePassword,sendResetEmail, userExists, createUser, sendVerificationEmail, validateUser, removeUser, findUser, findUserByEmail, findUserById };



