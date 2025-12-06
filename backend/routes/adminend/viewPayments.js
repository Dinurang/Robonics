// routes/adminend/viewPayments.js
import express from 'express';
const router = express.Router();
import pool from '../../db.js';

// GET all payments with filters
router.get('/', async (req, res) => {
  try {
    const { 
      projectID, 
      status, 
      startDate, 
      endDate
    } = req.query;
    
    const connection = await pool.getConnection();
    
    let query = `
      SELECT 
        p.paymentID,
        p.projectID,
        p.dueamount,
        p.status,
        p.paymentdate,
        u.username,
        u.whatsappNo
      FROM payment p
      LEFT JOIN project pr ON p.projectID = pr.projectID
      LEFT JOIN user u ON pr.userID = u.userID
      WHERE 1=1
    `;
    
    const params = [];
    
    // Filter by projectID (exact match or partial)
    if (projectID) {
      query += ' AND p.projectID LIKE ?';
      params.push(`%${projectID}%`);
    }
    
    // Filter by status
    if (status && status !== 'all') {
      query += ' AND p.status = ?';
      params.push(status);
    }
    
    // Filter by date range
    if (startDate) {
      query += ' AND DATE(p.paymentdate) >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND DATE(p.paymentdate) <= ?';
      params.push(endDate);
    }
    
    query += ' ORDER BY p.paymentdate DESC';
    
    const [payments] = await connection.execute(query, params);
    connection.release();
    
    // Format the data
    const formattedPayments = payments.map(payment => ({
      ...payment,
      paymentdate: payment.paymentdate ? new Date(payment.paymentdate).toISOString().split('T')[0] : null
    }));
    
    res.json(formattedPayments);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

// GET single payment by ID
router.get('/:paymentID', async (req, res) => {
  try {
    const { paymentID } = req.params;
    
    const connection = await pool.getConnection();
    const [payments] = await connection.execute(
      `SELECT 
        p.paymentID,
        p.projectID,
        p.dueamount,
        p.status,
        p.paymentdate,
        u.username,
        u.whatsappNo
      FROM payment p
      LEFT JOIN project pr ON p.projectID = pr.projectID
      LEFT JOIN user u ON pr.userID = u.userID
      WHERE p.paymentID = ?`,
      [paymentID]
    );
    
    connection.release();
    
    if (payments.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json(payments[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

// GET payments by projectID
router.get('/project/:projectID', async (req, res) => {
  try {
    const { projectID } = req.params;
    
    const connection = await pool.getConnection();
    
    const [payments] = await connection.execute(
      `SELECT 
        p.paymentID,
        p.projectID,
        p.dueamount,
        p.status,
        p.paymentdate,
        u.username,
        u.whatsappNo
      FROM payment p
      LEFT JOIN project pr ON p.projectID = pr.projectID
      LEFT JOIN user u ON pr.userID = u.userID
      WHERE p.projectID = ?
      ORDER BY p.paymentdate DESC`,
      [projectID]
    );
    
    connection.release();
    
    res.json(payments);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

// POST create new payment
router.post('/', async (req, res) => {
  try {
    const { projectID, dueamount, status, paymentdate } = req.body;
    
    // Validate required fields
    if (!projectID || !dueamount || !status) {
      return res.status(400).json({ message: 'projectID, dueamount, and status are required' });
    }
    
    // Validate amount
    if (parseFloat(dueamount) <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }
    
    // Validate status
    const validStatuses = ['incomplete', 'complete'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status must be either "incomplete" or "complete"' });
    }
    
    const connection = await pool.getConnection();
    
    // Check if project exists
    const [project] = await connection.execute(
      'SELECT projectID FROM project WHERE projectID = ?',
      [projectID]
    );
    
    if (project.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Create payment
    const [result] = await connection.execute(
      'INSERT INTO payment (projectID, dueamount, status, paymentdate) VALUES (?, ?, ?, ?)',
      [projectID, dueamount, status, paymentdate || new Date().toISOString().split('T')[0]]
    );
    
    // Get the created payment
    const [newPayment] = await connection.execute(
      `SELECT 
        p.paymentID,
        p.projectID,
        p.dueamount,
        p.status,
        p.paymentdate,
        u.username
      FROM payment p
      LEFT JOIN project pr ON p.projectID = pr.projectID
      LEFT JOIN user u ON pr.userID = u.userID
      WHERE p.paymentID = ?`,
      [result.insertId]
    );
    
    connection.release();
    
    res.status(201).json(newPayment[0]);
  } catch (error) {
    console.error('Database error:', error);
    
    // Check for duplicate entry error
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      return res.status(409).json({ message: 'Payment for this project already exists' });
    }
    
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

// PUT update payment
router.put('/:paymentID', async (req, res) => {
  try {
    const { paymentID } = req.params;
    const { status, dueamount, paymentdate } = req.body;
    
    const connection = await pool.getConnection();
    
    // Check if payment exists
    const [existing] = await connection.execute(
      'SELECT paymentID FROM payment WHERE paymentID = ?',
      [paymentID]
    );
    
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Build update query
    const updates = [];
    const params = [];
    
    if (status !== undefined) {
      // Validate status
      const validStatuses = ['incomplete', 'complete'];
      if (!validStatuses.includes(status)) {
        connection.release();
        return res.status(400).json({ message: 'Status must be either "incomplete" or "complete"' });
      }
      updates.push('status = ?');
      params.push(status);
    }
    
    if (dueamount !== undefined) {
      if (parseFloat(dueamount) <= 0) {
        connection.release();
        return res.status(400).json({ message: 'Amount must be greater than 0' });
      }
      updates.push('dueamount = ?');
      params.push(dueamount);
    }
    
    if (paymentdate !== undefined) {
      updates.push('paymentdate = ?');
      params.push(paymentdate);
    }
    
    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    params.push(paymentID);
    
    await connection.execute(
      `UPDATE payment SET ${updates.join(', ')} WHERE paymentID = ?`,
      params
    );
    
    // Get updated payment
    const [updatedPayment] = await connection.execute(
      `SELECT 
        p.paymentID,
        p.projectID,
        p.dueamount,
        p.status,
        p.paymentdate,
        u.username
      FROM payment p
      LEFT JOIN project pr ON p.projectID = pr.projectID
      LEFT JOIN user u ON pr.userID = u.userID
      WHERE p.paymentID = ?`,
      [paymentID]
    );
    
    connection.release();
    
    res.json(updatedPayment[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

// DELETE payment
router.delete('/:paymentID', async (req, res) => {
  try {
    const { paymentID } = req.params;
    
    const connection = await pool.getConnection();
    
    // Check if payment exists
    const [existing] = await connection.execute(
      'SELECT paymentID FROM payment WHERE paymentID = ?',
      [paymentID]
    );
    
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    await connection.execute(
      'DELETE FROM payment WHERE paymentID = ?',
      [paymentID]
    );
    
    connection.release();
    
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

export default router;