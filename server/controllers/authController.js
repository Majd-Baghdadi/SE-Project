// Handles authentication-related requests: signup, login, logout
const authValidation = require('../validations/authValidation');
const authService = require('../services/authService');
const jwt = require("jsonwebtoken");
const { generateAuthToken } = require("../utils/generateToken");
const bcrypt = require("bcryptjs/dist/bcrypt");

// Constants
const COOKIE_MAX_AGE = 10 * 24 * 60 * 60 * 1000; // 10 days
const COOKIE_CONFIG = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE
};


exports.logout = (req, res) => {
    res.clearCookie("auth_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};


exports.login = async (req, res) => {
    console.log('we are in login');
    try {
        const { email, password } = req.body;
        const validationResult = authValidation.validateLogin(email, password)
        if (validationResult.isValid) {

            const user = await authService.findUser(email);

            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid Email or Password'
                });
            }

            if (!user.verified) {
                return res.status(403).json({
                    success: false,
                    error: 'Email is not verified. Please check your email or request a new verification link.',
                    needsVerification: true,
                    email: user.email
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    error: 'Wrong Password'
                });
            }

            const token = generateAuthToken(user.id, user.role);

            res.cookie("auth_token", token, COOKIE_CONFIG);

            res.status(200).json({
                success: true,
                message: "Login successfully"
            });

        }
        else {
            return res.status(400).json(
                {
                    success: false,
                    errors: validationResult.errors
                }
            );
        }



    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            error: 'Login failed. Please try again.'
        });
    }
}


exports.register = async (req, res) => {
    console.log('we are in register');
    try {
        const { userName, email, password, role } = req.body;
        const validationResult = authValidation.validateRegister(userName, email, password, role);

        if (validationResult.isValid) {
            // checks if user existes
            if (await authService.userExists(email)) {
                return res.status(409).json({ success: false, error: 'Email already exists' });
            }

            //stor the user with verified false; 
            const user = await authService.createUser(userName, email, password, role, false);

            // Send verification email
            console.log('Sending verification email to:', email);
            try {
                await authService.sendVerificationEmail(user);

                return res.status(201).json({
                    success: true,
                    message: 'Registration successful. Please check your email to verify it.'
                });
            } catch (emailError) {
                console.error('Email failed:', emailError);
                // User is created but email failed
                return res.status(201).json({
                    success: true,
                    message: 'Registration successful but email failed. Please contact support.',
                    emailFailed: true
                });
            }
        }
        else {
            return res.status(400).json(
                {
                    success: false,
                    errors: validationResult.errors
                }
            );
        }

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            error: 'Registration failed. Please try again.'
        });
    }

}



exports.resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        // Find user by email
        const user = await authService.findUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'No account found with this email'
            });
        }

        // Check if already verified
        if (user.verified) {
            return res.status(400).json({
                success: false,
                error: 'Email is already verified. You can login.'
            });
        }

        // Send verification email
        await authService.sendVerificationEmail(user);

        return res.status(200).json({
            success: true,
            message: 'Verification email sent. Please check your inbox.'
        });

    } catch (error) {
        console.error('Resend verification email error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to send verification email. Please try again.'
        });
    }
}


exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'Verification token is required'
            });
        }


        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Check if token is for email verification
        if (decodedToken.purpose !== 'email_verification') {
            return res.status(400).json({
                success: false,
                error: 'Invalid verification token'
            });
        }

        const userId = decodedToken.userId;
        // Update user to verified
        const updatedUser = await authService.validateUser(userId);

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Generate auth token
        const authToken = generateAuthToken(userId,updatedUser.role);

        // Set cookie
        res.cookie("auth_token", authToken, COOKIE_CONFIG);

        return res.status(200).json({
            success: true,
            message: "Email verified successfully. You are now logged in.",
            user: {
                id: updatedUser.id,
                userName: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });

    } catch (error) {
        console.error("Email verification error:", error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Verification link has expired. Please register again or request a new verification email.'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid verification link. Please check the link and try again.'
            });
        }

        return res.status(500).json({
            success: false,
            error: 'Email verification failed. Please try again.'
        });
    }
}



exports.isLoggedIn = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await authService.findUserById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User authenticated',
            user: {
                id: user.id,
                userName: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('isLoggedIn error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get user info'
        });
    }
}



exports.sendResetEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: "Email is required"
            });
        }

        const user = await authService.findUserByEmail(email);

        if (!user) {
            // Security: Don't reveal if email exists or not
            return res.status(200).json({
                success: true,
                message: 'If an account with this email exists, a reset link has been sent.'
            });
        }

        await authService.sendResetEmail(user);

        return res.status(200).json({
            success: true,
            message: 'If an account with this email exists, a reset link has been sent.'
        });

    } catch (error) {
        console.error('Send reset email error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to send reset email. Please try again.'
        });
    }
}



exports.resetPassword = async (req, res) => {
    try {
        const { newPassword, token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'Reset token is required'
            });
        }

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters long'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if token is for password reset
        if (decoded.purpose !== 'password_reset') {
            return res.status(400).json({
                success: false,
                error: 'Invalid reset token'
            });
        }

        const userId = decoded.userId;

        const user = await authService.updatePassword(userId, newPassword);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully. You can now login with your new password.'
        });

    } catch (error) {
        console.error("Error resetting password:", error);

        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({
                success: false,
                error: 'Reset link has expired. Please request a new one.'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid reset link. Please request a new one.'
            });
        }

        return res.status(500).json({
            success: false,
            error: 'Failed to reset password. Please try again.'
        });
    }
}


