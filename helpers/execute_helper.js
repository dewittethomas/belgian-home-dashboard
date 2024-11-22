const errorStatusMap = {};

async function executeWithDetailedHandling(asyncFn, ...params) {
    try {
        if (typeof asyncFn !== 'function') {
            throw new TypeError('asyncFn must be a function');
        }

        const result = await asyncFn(...params);

        return {
            success: true,
            code: 200,
            ...result
        }
    } catch (error) {
        if (!error) {
            throw new Error('An unknown error occured');
        }

        const statusCode = determineStatusCode(error);

        return {
            success: false,
            code: statusCode,
            error: error.message ||'An unknown error occured'
        }
    }
}

function determineStatusCode(error) {
    return errorStatusMap[error.name] || 500; 
}

function createCustomError(name, defaultStatusCode) {
    errorStatusMap[name] = defaultStatusCode

    return class extends Error {
        constructor(message) {
            super(message);
            this.name = name;
            this.statusCode = defaultStatusCode;
        }
    };
}

// Custom error classes using the factory function
const NotFoundError = createCustomError("NotFoundError", 404);
const UnauthorizedError = createCustomError("UnauthorizedError", 401);
const ForbiddenError = createCustomError("ForbiddenError", 403);
const BadRequestError = createCustomError("BadRequestError", 400);
const RateLimitError = createCustomError("RateLimitError", 429);

export { 
    executeWithDetailedHandling, 
    NotFoundError,
    UnauthorizedError, 
    ForbiddenError,
    BadRequestError,
    RateLimitError
};