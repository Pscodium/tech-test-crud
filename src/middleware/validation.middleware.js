import { ValidationError } from '../utils/errors.js';

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
export const validateCustomerInput = (req, res, next) => {
    const { cpf, name, contacts } = req.body;
    const errors = [];

    if (req.method === 'POST' && !cpf) {
        errors.push('CPF is required');
    } else if (req.method === 'POST') {
        const formattedCpf = String(cpf).replace(/\D/g, '');
        if (formattedCpf.length !== 11) {
            errors.push('CPF must have 11 digits');
        }
        
    }

    if (!name && req.method === 'POST') {
        errors.push('Name is required');
    } else if (name && (typeof name !== 'string' || name.trim().length < 2)) {
        errors.push('Name must be a string with at least 2 characters');
    }

    if (contacts) {
        if (!Array.isArray(contacts)) {
            errors.push('Contacts must be an array');
        } else {
            contacts.forEach((contact, index) => {
                if (!contact.type) {
                    errors.push(`Contact at index ${index} is missing type`);
                } else if (!['PHONE', 'EMAIL'].includes(contact.type)) {
                    errors.push(`Contact type at index ${index} must be 'PHONE' or 'EMAIL'`);
                }
                
                if (!contact.value) {
                    errors.push(`Contact at index ${index} is missing value`);
                } else {

                    if (contact.type === 'EMAIL' && !isValidEmail(contact.value)) {
                        errors.push(`Invalid email format at index ${index}`);
                    }
                    
                    if (contact.type === 'PHONE' && !isValidPhone(contact.value)) {
                        errors.push(`Invalid phone format at index ${index}, should be DDD+number`);
                    }
                }
            });
        }
    }

    if (errors.length > 0) {
        return next(new ValidationError('Validation failed', errors));
    }

    if (req.method === 'POST' && cpf) {
        req.formattedCpf = String(cpf).replace(/\D/g, '');
    }

    next();
};

/**
 * 
 * @param {string} email 
 * @returns {boolean}
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 
 * @param {string} phone 
 * @returns {boolean}
 */
function isValidPhone(phone) {
    const numericPhone = phone.replace(/\D/g, '');
    
    return numericPhone.length >= 10 && numericPhone.length <= 11;
}