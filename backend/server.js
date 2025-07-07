const express = require("express");
const cors = require("cors");
const contactRoutes = require("./routes/contact");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/contact", contactRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to Robonics Backend!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
