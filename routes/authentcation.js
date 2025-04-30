const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log(" No Bearer token found:", authHeader);
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            console.log(" Token is missing in the request.");
            return res.status(400).json({ message: "Token is missing!" });
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log("❌ Invalid token:", err.message);
                return res.status(403).json({ message: "Forbidden: Invalid token" });
            }
        
            console.log("✅ Decoded Token:", decoded); // Log the decoded token
            req.user = decoded;
            next();
        });
        
    } catch (error) {
        console.error(" Error in authenticateToken:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { authenticateToken };