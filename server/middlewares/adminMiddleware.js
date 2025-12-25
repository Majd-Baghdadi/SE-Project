// Middleware to restrict access to admin-only routes
const jwt=require("jsonwebtoken")

function VerifyAdmin(req,res,next){
    if (req.user.role!=="admin") {
        return res.status(403).json({
            success:false,
            error:"You are not an admin"
        })
    } 
    next()
}

module.exports={VerifyAdmin};