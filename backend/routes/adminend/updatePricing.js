// updatePricing.js
import express from 'express';
import db from '../../db.js';

const router = express.Router();

// GET all project types with pricing and duration
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pricing ORDER BY projecttype');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new project type
router.post('/', async (req, res) => {
    const { project_type, pricing, duration } = req.body;
    try {
        // Check if project type already exists
        const [existing] = await db.query('SELECT * FROM pricing WHERE projecttype = ?', [project_type]);
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Project type already exists' });
        }
        
        await db.query(
            'INSERT INTO pricing (projecttype, pricing, duration) VALUES (?, ?, ?)',
            [project_type, pricing, duration || null]
        );
        
        // Return the newly created record
        const [newRow] = await db.query('SELECT * FROM pricing WHERE projecttype = ?', [project_type]);
        res.status(201).json(newRow[0]);
    } catch (err) {
        // Handle duplicate key error
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Project type already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// PUT update existing project type by project type name
router.put('/:projecttype', async (req, res) => {
    const { projecttype } = req.params;
    const { pricing, duration, new_projecttype } = req.body;
    
    try {
        // Check if project type exists
        const [existing] = await db.query('SELECT * FROM pricing WHERE projecttype = ?', [projecttype]);
        
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Project type not found' });
        }
        
        // If trying to rename, check if new name already exists
        if (new_projecttype && new_projecttype !== projecttype) {
            const [existingNew] = await db.query('SELECT * FROM pricing WHERE projecttype = ?', [new_projecttype]);
            
            if (existingNew.length > 0) {
                return res.status(400).json({ error: 'New project type name already exists' });
            }
        }
        
        // Update the record
        const updateProjectType = new_projecttype || projecttype;
        
        await db.query(
            'UPDATE pricing SET projecttype = ?, pricing = ?, duration = ? WHERE projecttype = ?',
            [updateProjectType, pricing, duration || null, projecttype]
        );
        
        // Return the updated record
        const [updatedRow] = await db.query('SELECT * FROM pricing WHERE projecttype = ?', [updateProjectType]);
        res.json(updatedRow[0]);
    } catch (err) {
        // Handle duplicate key error if renaming
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Project type already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// DELETE project type by project type name
router.delete('/:projecttype', async (req, res) => {
    const { projecttype } = req.params;
    
    try {
        // Check if project type exists
        const [existing] = await db.query('SELECT * FROM pricing WHERE projecttype = ?', [projecttype]);
        
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Project type not found' });
        }
        
        await db.query('DELETE FROM pricing WHERE projecttype = ?', [projecttype]);
        res.json({ message: 'Project type deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;