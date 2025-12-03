// routes/userend/register.js .... /register base URL
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../../db.js";

const router = express.Router();

// User Registration Endpoint
router.post("/", async (req, res) => {
    try {
        const { username, password, confirmPassword, whatsappNo, postalAddress } = req.body;

        console.log("Registration attempt:", { username, whatsappNo });

        // Validation
        if (!username || !password || !confirmPassword || !whatsappNo || !postalAddress) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(username)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        // WhatsApp number validation
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(whatsappNo)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid WhatsApp number (10-15 digits)"
            });
        }

        // Check if user already exists
        const [existingUsers] = await db.execute(
            "SELECT * FROM user WHERE username = ?",
            [username]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

       
        // Insert user into database
        await db.execute(
            `INSERT INTO user (username, password, whatsappNo, postal_address, role) 
             VALUES (?, ?, ?, ?, ?)`,
            [username, hashedPassword, whatsappNo, postalAddress, "User"]
        );

        

        // Get inserted user ID
        const [checkID] = await db.execute(
            "SELECT userID FROM user WHERE username = ?",
            [username]
        );

        const userID = checkID[0].userID;

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: userID,
                username: username,
                role: "User",
                whatsappNo: whatsappNo,
                postalAddress: postalAddress
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("User registered successfully:", { userID, username });

        // Response
        res.status(201).json({
            success: true,
            message: "Registration successful!",
            token: token,
            user: {
                userID,
                username,
                whatsappNo,
                postalAddress,
                role: "User"
            }
        });


    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
});

export default router;