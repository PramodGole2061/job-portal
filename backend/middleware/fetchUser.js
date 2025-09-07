const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const fetchUser = (req, res, next)=>{
    // Get the user using jwt token and add it to the req object
    const token = req.header("token");
    if(!token){
        return res.status(400).json({error: "Please authenticate using valid token."});
    }
    try {
        let data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next(); // it seems like this will make next in line function or other function to run
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

module.exports = fetchUser;