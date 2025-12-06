// routes/adminend/updateOrders.js
import express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/middleware.js';
import pool from '../../db.js';

// GET route to search for order by username or projectID
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const connection = await pool.getConnection();
    
    // Search by projectID or username
    const searchQuery = `
      SELECT 
        p.projectID,
        p.status as project_status,
        p.userID,
        p.order_date,
        p.cost,
        p.est_deadline,
        pd.description,
        pd.required_deadline,
        pd.deliverymode,
        py.status as payment_status,
        py.paymentdate,
        py.dueamount,
        u.username,
        u.whatsappNo,
        u.postal_address
      FROM project p
      LEFT JOIN project_data pd ON p.projectID = pd.projectID
      LEFT JOIN payment py ON p.projectID = py.projectID
      LEFT JOIN user u ON p.userID = u.userID
      WHERE p.projectID = ? OR u.username LIKE ?
      ORDER BY p.order_date DESC
      LIMIT 10
    `;
    
    const searchValue = isNaN(query) ? `%${query}%` : parseInt(query);
    const [results] = await connection.execute(searchQuery, [
      searchValue,
      searchValue
    ]);
    
    connection.release();
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'No orders found matching your search' });
    }
    
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

// PUT route to update order details
router.put('/:projectID', authenticateToken, async (req, res) => {
  try {
    const { projectID } = req.params;
    const { cost, est_deadline } = req.body;
    
    if (!projectID) {
      return res.status(400).json({ message: 'Project ID is required' });
    }
    
    // Validate that at least one field is provided
    if (cost === undefined && est_deadline === undefined) {
      return res.status(400).json({ message: 'At least one field (cost or est_deadline) must be provided' });
    }
    
    const connection = await pool.getConnection();
    
    // Build dynamic update query based on provided fields
    const updates = [];
    const values = [];
    
    if (cost !== undefined) {
      updates.push('cost = ?');
      values.push(cost);
    }
    
    if (est_deadline !== undefined) {
      updates.push('est_deadline = ?');
      values.push(est_deadline);
    }
    
    values.push(projectID);
    
    const updateQuery = `
      UPDATE project 
      SET ${updates.join(', ')} 
      WHERE projectID = ?
    `;
    
    const [result] = await connection.execute(updateQuery, values);
    
    // Also update payment if cost is changed
    if (cost !== undefined) {
      const paymentUpdateQuery = `
        UPDATE payment 
        SET dueamount = ? 
        WHERE projectID = ?
      `;
      await connection.execute(paymentUpdateQuery, [cost, projectID]);
    }
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ 
      message: 'Order updated successfully',
      projectID,
      updates: {
        ...(cost !== undefined && { cost }),
        ...(est_deadline !== undefined && { est_deadline })
      }
    });
    
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

// GET route to get order details by projectID
router.get('/:projectID', authenticateToken, async (req, res) => {
  try {
    const { projectID } = req.params;
    
    const connection = await pool.getConnection();
    
    const query = `
      SELECT 
        p.projectID,
        p.status as project_status,
        p.userID,
        p.order_date,
        p.cost,
        p.est_deadline,
        pd.description,
        pd.required_deadline,
        pd.deliverymode,
        py.status as payment_status,
        py.paymentdate,
        py.amount,
        u.username,
        u.whatsappNo,
        u.postal_address
      FROM project p
      LEFT JOIN project_data pd ON p.projectID = pd.projectID
      LEFT JOIN payment py ON p.projectID = py.projectID
      LEFT JOIN user u ON p.userID = u.userID
      WHERE p.projectID = ?
    `;
    
    const [results] = await connection.execute(query, [projectID]);
    connection.release();
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(results[0]);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

export default router;