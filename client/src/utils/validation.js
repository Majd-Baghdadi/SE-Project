/**
 * Validation Utilities
 * 
 * Purpose: Common validation functions for forms
 */

export const validators = {
  required: (value) => {
    if (!value || value.trim() === '') {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Invalid email address';
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Must be less than ${max} characters`;
    }
    return null;
  },

  number: (value) => {
    if (isNaN(value)) {
      return 'Must be a number';
    }
    return null;
  },

  positiveNumber: (value) => {
    if (isNaN(value) || Number(value) <= 0) {
      return 'Must be a positive number';
    }
    return null;
  },
};

// Combine multiple validators
export const composeValidators = (...validators) => (value) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};
