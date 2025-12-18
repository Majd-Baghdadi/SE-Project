// Middleware to restrict access to user-only routes
const jwt=require("jsonwebtoken")

function VerifyUser(req,res,next){
    if (req.user!=="user") {
        return res.status(403).json({
            success:false,
            error:"You are not a user"
        })
    } 
    next()
}

module.exports={VerifyUser};