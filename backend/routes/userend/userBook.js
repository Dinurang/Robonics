// // routes/userend/userBook.js
import express from 'express';
import pool from '../../db.js';
import { authenticateToken } from '../middleware/middleware.js';

const router = express.Router();

// GET all projects for the logged-in user

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userID || req.user.id || req.user.userId || req.user.userid;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID not found in token' });
    }

    const [projects] = await pool.execute(
      `SELECT p.projectID, pd.description, pd.required_deadline, pd.deliverymode, 
              p.status, p.order_date
       FROM project p
       JOIN project_data pd ON p.projectID = pd.projectID
       WHERE p.userID = ? 
       ORDER BY p.projectID DESC`,
      [userId]
    );

    res.json({ success: true, projects });
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST a new project booking
router.post('/', authenticateToken, async (req, res) => {


  try {
    const userId = req.user.userID || req.user.id || req.user.userId || req.user.userid;
    const { description, required_deadline, deliverymode } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID not found in token' });
    }

    if (!description || !required_deadline || !deliverymode) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    // Insert into project table (est_deadline is not set here - will be filled later)
    const orderDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const [projectResult] = await pool.execute(
      `INSERT INTO project (status, userID, order_date) 
       VALUES (?, ?, ?)`,
      ['ongoing', userId, orderDate]
    );

    const projectID = projectResult.insertId;

    // Insert into project_data table
    await pool.execute(
      `INSERT INTO project_data (projectID, description, required_deadline, deliverymode)
       VALUES (?, ?, ?, ?)`,
      [projectID, description, required_deadline, deliverymode]
    );

    res.json({ success: true, message: 'Project booked successfully!', projectID });
  } catch (error) {
    console.error('❌ Error booking project:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;

