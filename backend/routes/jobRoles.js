const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/auth');

// Get all job roles
router.get('/', asyncHandler(async (req, res) => {
    try {
        const result = await req.db.query(
            'SELECT id, title, description, required_skills, experience_level, salary_range, domain FROM job_roles ORDER BY domain, title'
        );

        const rows = result.rows;

        // Group by Domain
        const groupedRoles = rows.reduce((acc, role) => {
            const domain = role.domain || 'Other';
            if (!acc[domain]) {
                acc[domain] = [];
            }
            acc[domain].push(role);
            return acc;
        }, {});

        // Format as array
        const responseData = Object.keys(groupedRoles).sort().map(domain => ({
            domain,
            roles: groupedRoles[domain]
        }));

        res.json(responseData);
    } catch (error) {
        console.error('Job roles fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch job roles' });
    }
}));

// Get specific job role
router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const result = await req.db.query(
            'SELECT id, title, description, required_skills, experience_level, salary_range, domain FROM job_roles WHERE id = $1',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Job role not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Job role fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch job role' });
    }
}));

module.exports = router;
