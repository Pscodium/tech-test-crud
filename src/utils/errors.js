export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(resource = 'Resource', id = '') {
        super(`${resource} not found${id ? ` with ID: ${id}` : ''}`, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
    }
}

export class ValidationError extends AppError {
    constructor(message, errors = []) {
        super(message, 400);
        this.errors = errors;
    }
}