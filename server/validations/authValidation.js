// Request validation schemas for authentication endpoints


const validateRegister = (name, email, password, role) => {
    const errors = [];

    // Validate name
    if (!name || name.trim().length === 0) {
        errors.push('Name is required');
    } else if (name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    // Validate email
    validateEmail(email, errors);

    validatePassword(password, errors);

    // Validate role (required)
    if (!role || role.trim().length === 0) {
        errors.push('Role is required');
    } else if (!['user', 'admin'].includes(role)) {
        errors.push('Invalid role. Must be user or admin');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};


const validateLogin = (email, password) => {
    const errors = [];

    // Validate email
    validateEmail(email, errors)

    // Validate password
    validatePassword(password, errors);

    return {
        isValid: errors.length === 0,
        errors
    };

}

module.exports = { validateRegister, validateLogin };




function validatePassword(password, errors) {
    if (!password || password.length === 0) {
        errors.push('Password is required');
    } else if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
}

function validateEmail(email, errors) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.trim().length === 0) {
        errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
        errors.push('Invalid email format');
    }
}

