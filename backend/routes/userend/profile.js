// routes/user/profile.js
import express from "express";
import db from "../../db.js";

const router = express.Router();

// Get user profile (protected)
router.get("/", async (req, res) => {
    try {
        const [users] = await db.execute(
            "SELECT userID, username, whatsappNo, postal_address, role FROM users WHERE userID = ?",
            [req.user.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: users[0]
        });
    } catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// Update user profile (protected)
router.put("/", async (req, res) => {
    try {
        const { whatsappNo, postalAddress } = req.body;
        const userId = req.user.userId;

        await db.execute(
            "UPDATE users SET whatsappNo = ?, postal_address = ? WHERE userID = ?",
            [whatsappNo, postalAddress, userId]
        );

        res.json({
            success: true,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

export default router;