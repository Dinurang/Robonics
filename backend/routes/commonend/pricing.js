import express from 'express';
import db from "../../db.js";
const router = express.Router();

// GET all projects (filtering out NULL rows)
router.get('/', async (req, res) => {
  try {
    // Use db.query() instead of db.execute() if that's what your db.js exports
    const [results] = await db.query(`
      SELECT projecttype, pricing, duration 
      FROM pricing
      WHERE projecttype IS NOT NULL 
        AND pricing IS NOT NULL 
        
      ORDER BY projecttype
    `);
    
    // Return as JSON
    res.json(results);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Database error', 
      message: error.message 
    });
  }
});

export default router;