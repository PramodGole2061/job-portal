const jwt = require('jsonwebtoken');

// Fetch the secret key from your .env file
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware: fetchUser
 * Purpose: Decodes the JWT from the request header and attaches the user data 
 * (ID and Role) to the request object (req.user) for use in protected routes.
 */
const fetchUser = (req, res, next) => {
    // 1. Get the token from the header named 'auth-token'
    const token = req.header('auth-token');

    // 2. If no token is provided, return an error
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            error: "Access Denied. Please authenticate using a valid token." 
        });
    }

    try {
        // 3. Verify the token using your secret key
        // Based on our auth routes, the payload 'data' contains: { user: { id: "...", role: "..." } }
        const data = jwt.verify(token, JWT_SECRET);

        // 4. Attach the user data to the request object
        // Now you can access req.user.id and req.user.role in your routes
        req.user = data.user;

        // 5. Call next() to proceed to the actual route handler or the next middleware
        next();
        
    } catch (error) {
        // 6. If token is invalid or expired, return an error
        return res.status(401).json({ 
            success: false, 
            error: "Invalid or expired token. Please log in again." 
        });
    }
}

module.exports = fetchUser;