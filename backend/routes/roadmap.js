const express = require('express');
const router = express.Router();
const { verifyToken, asyncHandler } = require('../middleware/auth');

// ===============================
// CREATE ROADMAP
// ===============================
router.post('/', verifyToken, asyncHandler(async (req, res) => {
  const { jobRoleId } = req.body;
  if (!jobRoleId) return res.status(400).json({ error: "Job role required" });

  const client = await req.db.connect();
  try {
    await client.query('BEGIN');

    const analysis = await client.query(
      `SELECT missing_skills
       FROM skill_gap_analysis
       WHERE user_id=$1 AND job_role_id=$2
       ORDER BY analysis_date DESC
       LIMIT 1`,
      [req.user.userId, jobRoleId]
    );

    if (analysis.rows.length === 0)
      return res.status(400).json({ error: "Run skill analysis first" });

    const skills = analysis.rows[0].missing_skills;

    const roadmapResult = await client.query(
      `INSERT INTO learning_roadmaps (user_id, job_role_id, title, timeline_weeks, status)
       VALUES ($1,$2,$3,12,'active')
       RETURNING *`,
      [req.user.userId, jobRoleId, "Learning Roadmap"]
    );

    const roadmap = roadmapResult.rows[0];

    let step = 1;
    for (const skill of skills) {
      await client.query(
        `INSERT INTO roadmap_steps
         (roadmap_id, step_number, title, description, duration_days, order_sequence)
         VALUES ($1,$2,$3,$4,7,$2)`,
        [roadmap.id, step, `Learn ${skill}`, `Practice ${skill}`]
      );
      step++;
    }

    await client.query('COMMIT');
    res.json({ message: "Roadmap created" });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: "Failed to create roadmap" });
  } finally {
    client.release();
  }
}));

// ===============================
// GET ROADMAP FOR USER
// ===============================
router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const roadmap = await req.db.query(
    `SELECT *
     FROM learning_roadmaps
     WHERE user_id=$1
     ORDER BY created_at DESC
     LIMIT 1`,
    [req.user.userId]
  );

  if (roadmap.rows.length === 0) return res.json(null);

  const steps = await req.db.query(
    `SELECT * FROM roadmap_steps
     WHERE roadmap_id=$1
     ORDER BY order_sequence`,
    [roadmap.rows[0].id]
  );

  res.json({
    ...roadmap.rows[0],
    steps: steps.rows
  });
}));

// ===============================
// TOGGLE STEP
// ===============================
router.put('/step/:id', verifyToken, asyncHandler(async (req, res) => {
  await req.db.query(
    `UPDATE roadmap_steps SET completed = NOT completed WHERE id=$1`,
    [req.params.id]
  );
  res.json({ message: "Step updated" });
}));

module.exports = router;
