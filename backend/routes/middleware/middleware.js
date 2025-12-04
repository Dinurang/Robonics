// routes/middleware/middleware.js
import jwt from "jsonwebtoken";

// Middleware to authenticate JWT token
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token required"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
        req.user = user;
        next();
    });
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
    if (req.user.role !== "Admin" && req.user.role !== "Administrator") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }
    next();
};

// Middleware to check if user is regular user
export const isUser = (req, res, next) => {
    if (req.user.role !== "User") {
        return res.status(403).json({
            success: false,
            message: "Access denied. User privileges required."
        });
    }
    next();
};

// Middleware to check if user is owner
export const isOwner = (req, res, next) => {
    if (req.user.role !== "Owner") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Owner privileges required."
        });
    }
    next();
};

// Optional: Export as default object
export default {
    authenticateToken,
    isAdmin,
    isUser,
    isOwner
};