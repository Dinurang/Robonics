const express = require("express");
const router = express.Router();

// POST /api/contact
router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  console.log("New Contact Submission:");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Message:", message);

  // (Optional) Save to database here

  res.status(200).json({ message: "Message received successfully!" });
});

module.exports = router;
