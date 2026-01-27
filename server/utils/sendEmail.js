const nodemailer = require('nodemailer');
require("dotenv").config();

module.exports = async (to, subject, html) => {
    try {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            }
        });

        await transport.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        });
        
        console.log('Email sent successfully to:', to);
        
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Let caller handle the error
    }
}