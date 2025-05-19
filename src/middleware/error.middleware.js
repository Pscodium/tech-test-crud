/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { AppError } from '../utils/errors.js';

/**
 * 
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export default function errorMiddleware(err, req, res, next) {    
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            status: 'error',
            message: 'A record with this unique value already exists',
            error: err.sqlMessage
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            ...(err.errors && { errors: err.errors })
        });
    }

    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        ...(process.env.NODE_ENV !== 'production' && { 
            error: err.message,
            stack: err.stack
        })
    });
}