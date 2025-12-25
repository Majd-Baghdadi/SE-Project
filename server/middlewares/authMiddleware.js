// Middleware to verify JWT token from HttpOnly cookie
const jwt = require("jsonwebtoken");

exports.verifyAuthToken = (req, res, next) => {
    try {
        const token = req.cookies?.auth_token;

        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Not authenticated"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify this is an auth token, not a verification/reset token
        if (decoded.purpose !== 'auth') {
            return res.status(401).json({
                success: false,
                error: "Invalid token type"
            });
        }

        req.user = decoded;

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: "Session expired. Please login again."
            });
        }
        return res.status(401).json({
            success: false,
            error: "Invalid or expired token"
        });
    }
}