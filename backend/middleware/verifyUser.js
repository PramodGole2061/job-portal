import jwt from 'jsonwebtoken';

const verifyUser = (req, res, next) => {
    const token = req.header('auth-token');

    if (!process.env.JWT_SECRET) {
        console.error("CRITICAL ERROR: JWT_SECRET is not defined in .env file.");
        return res.status(500).json({ success: false, error: "Internal Server Configuration Error." });
    }

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            error: "Authentication Failed: No token provided. Access Denied." 
        });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the expected data structure exists in the token
        if (!data.user || !data.user.id || !data.user.role) {
            return res.status(401).json({ 
                success: false, 
                error: "Authentication Failed: Malformed token." 
            });
        }

        // Attach the verified user data to the request object
        req.user = data.user;

        next();
        
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            error: "Authentication Failed: Invalid or expired token. Please log in again." 
        });
    }
}

export default verifyUser;