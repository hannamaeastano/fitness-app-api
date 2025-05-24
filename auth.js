const jwt = require("jsonwebtoken");
require('dotenv').config();

// Create Access Token
module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email
    };

    return jwt.sign(data, process.env.AUTH_SECRET_KEY, { expiresIn: "1h" }); // Add token expiration for security
};

// Verify Token
module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ auth: "Failed", message: "No Token Provided" });
    }

    // Handle tokens with or without "Bearer " prefix
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.AUTH_SECRET_KEY, (err, decodedToken) => {
        if (err) {
            console.error("Token Verification Error:", err.message);
            return res.status(403).json({ auth: "Failed", message: err.message });
        } else {
            console.log("Decoded Token in verify middleware:", decodedToken); // Debug log
            req.user = decodedToken; // Attach the decoded token to the request
            next();
        }
    });
};

// Error Handler
module.exports.errorHandler = (err, req, res, next) => {
    console.error("Error Handler:", err); // Debug log

    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: {
            message: errorMessage,
            errorCode: err.code || 'SERVER_ERROR',
            details: err.details || null
        }
    });
};