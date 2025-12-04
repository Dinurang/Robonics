// routes/userend/userProfile.js - FIXED
import express from 'express';
import pool from '../../db.js';
import { authenticateToken } from '../middleware/middleware.js';

const router = express.Router();

// GET user profile - /user/profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 Fetching profile for user:', req.user);
    
    // Get user ID from token
    const userId = req.user.userID || req.user.id || req.user.userId || req.user.userid;
    
    if (!userId) {
      console.error('❌ No user ID found in token');
      return res.status(400).json({ 
        success: false,
        error: 'User ID not found in token' 
      });
    }
    
    console.log('📊 Querying database for user ID:', userId);
    
    // FIXED: Table name is 'user' not 'users'
    const [rows] = await pool.execute(
      'SELECT userID, username, whatsappNo, postal_address, role FROM user WHERE userID = ?',
      [userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    const userProfile = rows[0];
    console.log('✅ Profile found for:', userProfile.username);
    
    res.json({
      success: true,
      profile: userProfile
    });
    
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// PUT update user profile - /user/profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    console.log('✏️ Updating profile for user:', req.user);
    console.log('📦 Request body:', req.body);
    
    const userId = req.user.userID || req.user.id || req.user.userId || req.user.userid;
    const { whatsappNo, postal_address } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        error: 'User ID not found in token' 
      });
    }
    
    // Validate required fields
    if (!whatsappNo || !postal_address) {
      return res.status(400).json({ 
        success: false,
        error: 'whatsappNo and postal_address are required' 
      });
    }
    
    // Validate WhatsApp number format (10-15 digits)
    const whatsappRegex = /^[0-9]{10,15}$/;
    if (!whatsappRegex.test(whatsappNo)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid WhatsApp number format (10-15 digits only)' 
      });
    }
    
    // Validate postal address length
    if (postal_address.trim().length < 5) {
      return res.status(400).json({ 
        success: false,
        error: 'Postal address must be at least 5 characters long' 
      });
    }
    
    // FIXED: Table name is 'user' not 'users'
    const [result] = await pool.execute(
      `UPDATE user 
       SET whatsappNo = ?, 
           postal_address = ?
       WHERE userID = ?`,
      [whatsappNo.trim(), postal_address.trim(), userId]
    );
    
    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found or no changes made' 
      });
    }
    
    // Get the updated profile
    const [updatedRows] = await pool.execute(
      'SELECT userID, username, whatsappNo, postal_address, role FROM user WHERE userID = ?',
      [userId]
    );
    
    const updatedProfile = updatedRows[0];
    console.log('✅ Profile updated successfully for:', updatedProfile.username);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile
    });
    
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    
    // Handle specific MySQL errors
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false,
        error: 'WhatsApp number already in use' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});



export default router;