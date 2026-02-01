const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/auth');

// Get all skills
router.get('/', asyncHandler(async (req, res) => {
    try {
        const result = await req.db.query(
            'SELECT id, name, category FROM skills ORDER BY category, name'
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Skills fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
}));

// Get skills by category
router.get('/category/:category', asyncHandler(async (req, res) => {
    try {
        const result = await req.db.query(
            'SELECT id, name, category FROM skills WHERE category = $1 ORDER BY name',
            [req.params.category]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Skills fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
}));

module.exports = router;
