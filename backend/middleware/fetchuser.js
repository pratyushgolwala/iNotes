const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET; // Read secret key from .env

const fetchUser = (req, res, next) => {
    // Get the user from the JWT token and add id to req object
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user; // Store user data in request
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = fetchUser;
