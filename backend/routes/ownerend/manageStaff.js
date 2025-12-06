// routes/adminend/manageStaff.js
import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();

import { authenticateToken, isOwner } from '../middleware/middleware.js';
import pool from '../../db.js';

// GET all administrators (only for owner)
router.get('/', authenticateToken, isOwner, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const query = `
      SELECT adminID, adminemail, role 
      FROM admin 
      WHERE role = 'Administrator'
      ORDER BY adminID DESC
    `;
    
    const [admins] = await connection.execute(query);
    connection.release();
    
    res.json(admins);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

// Create new administrator
router.post('/', authenticateToken, isOwner, async (req, res) => {
  try {
    const { adminemail, password } = req.body;
    
    // Validation
    if (!adminemail || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    if (!isValidEmail(adminemail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    const connection = await pool.getConnection();
    
    // Check if admin already exists
    const checkQuery = 'SELECT adminID FROM admin WHERE adminemail = ?';
    const [existingAdmins] = await connection.execute(checkQuery, [adminemail]);
    
    if (existingAdmins.length > 0) {
      connection.release();
      return res.status(409).json({ message: 'Administrator with this email already exists' });
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert new administrator
    const insertQuery = `
      INSERT INTO admin (adminemail, password, role) 
      VALUES (?, ?, 'Administrator')
    `;
    
    const [result] = await connection.execute(insertQuery, [adminemail, hashedPassword]);
    
    // Get the created admin details
    const getQuery = 'SELECT adminID, adminemail, role FROM admin WHERE adminID = ?';
    const [newAdmin] = await connection.execute(getQuery, [result.insertId]);
    
    connection.release();
    
    res.status(201).json({
      message: 'Administrator created successfully',
      admin: newAdmin[0]
    });
    
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

// Delete administrator
router.delete('/:adminID', authenticateToken, isOwner, async (req, res) => {
  try {
    const { adminID } = req.params;
    
    if (!adminID || isNaN(adminID)) {
      return res.status(400).json({ message: 'Valid admin ID is required' });
    }
    
    const connection = await pool.getConnection();
    
    // Prevent deleting owner
    const checkQuery = 'SELECT role FROM admin WHERE adminID = ?';
    const [admin] = await connection.execute(checkQuery, [adminID]);
    
    if (admin.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Administrator not found' });
    }
    
    if (admin[0].role === 'Owner') {
      connection.release();
      return res.status(403).json({ message: 'Cannot delete owner account' });
    }
    
    // Delete administrator
    const deleteQuery = 'DELETE FROM admin WHERE adminID = ?';
    const [result] = await connection.execute(deleteQuery, [adminID]);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Administrator not found' });
    }
    
    res.json({ 
      message: 'Administrator deleted successfully',
      adminID: parseInt(adminID)
    });
    
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default router;