// Middleware to restrict access to user-only routes

function VerifyUser(req,res,next){
    console.log(req.user)
    if (req.user.role!=="user") {
        return res.status(403).json({
            success:false,
            error:"You are not a user"
        })
    } 
    next()
}

module.exports={VerifyUser};