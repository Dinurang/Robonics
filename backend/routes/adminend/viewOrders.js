// routes/adminend/viewOrders.js
import express from 'express';
const router = express.Router();

import { authenticateToken, isAdmin } from '../middleware/middleware.js';
import pool from '../../db.js';

router.get('/', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const query = `
      SELECT 
        p.projectID,
        pd.description,
        pd.required_deadline,
        pd.deliverymode,
        p.userID,
        p.status as project_status,
        p.order_date,
        p.cost,
        p.est_deadline,
        py.status as payment_status,
        py.paymentdate as payment_date,
        py.dueamount as payment_amount,
        u.username,
        u.whatsappNo,
        u.postal_address
      FROM project p
      LEFT JOIN project_data pd ON p.projectID = pd.projectID
      LEFT JOIN payment py ON p.projectID = py.projectID
      LEFT JOIN user u ON p.userID = u.userID
      ORDER BY p.order_date DESC
    `;
    
    const [orders] = await connection.execute(query);
    connection.release();
    
    res.json(orders);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

export default router;