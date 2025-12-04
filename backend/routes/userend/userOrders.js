import express from 'express';
import pool from '../../db.js';
import { authenticateToken } from '../middleware/middleware.js';


const router = express.Router();

// GET all orders/projects for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userID || req.user.id || req.user.userId || req.user.userid;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID not found in token' });
    }

    const [orders] = await pool.execute(
      `SELECT 
        p.projectID,
        p.status,
        p.order_date,
        p.cost,
        p.est_deadline,
        p.payment_date,
        pd.description,
        pd.required_deadline,
        pd.deliverymode
       FROM project p
       LEFT JOIN project_data pd ON p.projectID = pd.projectID
       LEFT JOIN user u ON p.userID = u.userID
       WHERE p.userID = ?
       ORDER BY p.order_date DESC, p.projectID DESC`,
      [userId]
    );

    res.json({ success: true, orders });
  } catch (error) {
    console.error('❌ Error fetching user orders:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PATCH/UPDATE project description (append with timestamp)
router.patch('/:projectID/description', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userID || req.user.id || req.user.userId || req.user.userid;
    const { projectID } = req.params;
    const { newDescriptionText } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID not found in token' });
    }

    if (!newDescriptionText || newDescriptionText.trim() === '') {
      return res.status(400).json({ success: false, error: 'Description text is required' });
    }

    // First, verify the project belongs to the user
    const [projectCheck] = await pool.execute(
      `SELECT p.projectID, pd.description 
       FROM project p
       LEFT JOIN project_data pd ON p.projectID = pd.projectID
       WHERE p.projectID = ? AND p.userID = ?`,
      [projectID, userId]
    );

    if (projectCheck.length === 0) {
      return res.status(404).json({ success: false, error: 'Project not found or unauthorized' });
    }

    // Get current description
    const currentDescription = projectCheck[0].description || '';
    
    // Create updated description: current + new text with timestamp
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const updatedDescription = `${currentDescription}\n\n[UPDATE ${timestamp}]: ${newDescriptionText}`;

    // Update the description in project_data
    await pool.execute(
      `UPDATE project_data 
       SET description = ? 
       WHERE projectID = ?`,
      [updatedDescription, projectID]
    );

    res.json({ 
      success: true, 
      message: 'Description updated successfully!',
      updatedDescription 
    });
  } catch (error) {
    console.error('❌ Error updating description:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET single order details
router.get('/:projectID', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userID || req.user.id || req.user.userId || req.user.userid;
    const { projectID } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID not found in token' });
    }

    const [order] = await pool.execute(
      `SELECT 
        p.projectID,
        p.status,
        p.order_date,
        p.cost,
        p.est_deadline,
        p.payment_date,
        pd.description,
        pd.required_deadline,
        pd.deliverymode
       FROM project p
       LEFT JOIN project_data pd ON p.projectID = pd.projectID
       LEFT JOIN uses u ON p.userID = u.userID
       WHERE p.projectID = ? AND p.userID = ?`,
      [projectID, userId]
    );

    if (order.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, order: order[0] });
  } catch (error) {
    console.error('❌ Error fetching order details:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
