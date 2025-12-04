// routes/auth/login.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../../db.js";

const router = express.Router();

// User/Admin Login Endpoint
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Step 1: Check if user is admin
    const [admins] = await db.execute(
      "SELECT * FROM admin WHERE adminemail = ?",
      [username]
    );

    if (admins.length > 0) {
      const admin = admins[0];
      const isAdminPasswordValid = await bcrypt.compare(password, admin.password);

      if (isAdminPasswordValid) {
        const token = jwt.sign(
          {
            userId: admin.id,
            username: admin.username,
            role: admin.role
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return res.json({
          success: true,
          message: "Admin login successful",
          token,
          user: {
            id: admin.id,
            username: admin.username,
            role: admin.role
          }
        });
      }
    }

    // Step 2: If not admin, check normal users
    const [users] = await db.execute(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = users[0];
    const isUserPasswordValid = await bcrypt.compare(password, user.password);

    if (!isUserPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate JWT token for user
    const token = jwt.sign(
      {
        userId: user.userID,
        username: user.username,
        role: "User",
        whatsappNo: user.whatsappNo,
        postalAddress: user.postal_address
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        userID: user.userID,
        username: user.username,
        whatsappNo: user.whatsappNo,
        postalAddress: user.postal_address,
        role: "User"
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
});

export default router;
