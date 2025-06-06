function isAsync(fn) {
    return fn.constructor.name === "AsyncFunction";
}

async function executeWithDetailedHandling(fn, ...params) {
    try {
        let result;

        if (typeof fn !== 'function') throw new Error("Invalid function provided.");
        if (isAsync(fn)) result = await fn(...params);
        else result = fn(...params);

        return {
            success: true,
            code: 200,
            data: result
        }
    } catch (error) {
        return {
            success: false,
            code: 500,
            data: {}
        }
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}   

export { executeWithDetailedHandling, NotFoundError };