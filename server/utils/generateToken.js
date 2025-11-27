// Helper function for JWT token creation

const jwt = require("jsonwebtoken");


const generateVerificationToken = (userId) => {
    const token = jwt.sign(
        {
            userId,
            purpose: 'email_verification'
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // or 3600 for seconds
    );

    return token;
};


const generateAuthToken=(userId)=>{
      const token = jwt.sign(
        {
            userId,
            purpose: 'auth'
        },
        process.env.JWT_SECRET,
        { expiresIn: '10d' } 
    );

    return token;
}



module.exports = {generateVerificationToken,generateAuthToken} ;


