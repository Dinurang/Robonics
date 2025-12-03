// middleware/authMiddleware.js
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
    if (req.user.role !== "Admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied"
        });
    }
    next();
};


// Middleware to check if user is admin
export const isUser = (req, res, next) => {
    if (req.user.role !== "User") {
        return res.status(403).json({
            success: false,
            message: "Access denied"
        });
    }
    next();
};


// Middleware to check if user is admin
export const isOwner = (req, res, next) => {
    if (req.user.role !== "Owner") {
        return res.status(403).json({
            success: false,
            message: "Access denied"
        });
    }
    next();
};