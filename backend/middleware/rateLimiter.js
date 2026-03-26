import rateLimit from 'express-rate-limit';

//for general api
export const apiLimiter = rateLimit({
    // 15 minutes
    windowMs: 15 * 60 * 1000,
    max: 100, 
    message: {
        success: false,
        error: "Too many requests from this IP. Please try again after 15 minutes."
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

//for authentication api
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: {
        success: false,
        error: "Too many authentication attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});