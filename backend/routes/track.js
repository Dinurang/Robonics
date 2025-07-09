const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/track?input=emailOrPhone
router.get('/', (req, res) => {
  const input = req.query.input;

  if (!input) {
    return res.status(400).json({ success: false, message: "Input is required" });
  }

   const sql = `SELECT * FROM bookings WHERE client_email = ? OR client_phone = ?`;
  db.query(sql, [input, input], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
    res.json({ success: true, data: results });
  });
});

module.exports = router;
