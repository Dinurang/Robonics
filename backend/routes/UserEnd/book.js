const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { projectDescription, deadline, clientName, clientEmail, clientPhone } = req.body;

  const sql = `
    INSERT INTO bookings (project_description, deadline, client_name, client_email, client_phone)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [projectDescription, deadline, clientName, clientEmail, clientPhone], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to save booking.');
    }
    res.send('Booking submitted successfully.');
  });
});

module.exports = router;
