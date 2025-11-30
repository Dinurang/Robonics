const express = require('express');
const router = express.Router();
const db = require('../db');

// Simple hardcoded admin auth
const ADMIN_PASSWORD = "robonics123";

// Middleware for basic auth
router.use((req, res, next) => {
  const { password } = req.query;
  if (password !== ADMIN_PASSWORD) return res.status(401).send("Unauthorized");
  next();
});

// Get all bookings
router.get('/bookings', (req, res) => {
  db.query("SELECT * FROM bookings", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "DB error" });
    res.json({ success: true, data: results });
  });
});

// Update booking status
router.put('/bookings/:id', express.json(), (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sql = `UPDATE bookings SET status = ? WHERE id = ?`;
  db.query(sql, [status, id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Update failed" });
    res.json({ success: true });
  });
});

// Get all contacts
router.get('/contacts', (req, res) => {
  db.query("SELECT * FROM contacts", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "DB error" });
    res.json({ success: true, data: results });
  });
});

module.exports = router;
