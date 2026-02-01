const express = require('express');
const router = express.Router();
const { verifyToken, asyncHandler } = require('../middleware/auth');
const { analyzeSkillGap } = require('../utils/skillGapAnalyzer');
const { generateRoadmap } = require('../utils/roadmapGenerator');
const { inferSkillsFromCustomRole } = require('../utils/customRoleSkillInferencer');

// ================================
// POST: Skill Gap Analysis
// ================================
router.post('/gap', verifyToken, asyncHandler(async (req, res) => {
  const { jobRoleId, customRole } = req.body;

  if (!jobRoleId && !customRole) {
    return res.status(400).json({ error: 'Job role ID or Custom Role is required' });
  }

  try {
    let jobRole = null;
    let requiredSkills = [];

    // 1️⃣ Fetch job role if ID is provided
    if (jobRoleId) {
      const jobRoleResult = await req.db.query(
        'SELECT id, title, required_skills FROM job_roles WHERE id = $1',
        [jobRoleId]
      );

      if (jobRoleResult.rows.length > 0) {
        jobRole = jobRoleResult.rows[0];
        requiredSkills = jobRole.required_skills || [];
      }
    }

    // 1b️⃣ Handle Custom Role
    if (!jobRole && customRole) {
      jobRole = { id: 'custom', title: customRole };
      requiredSkills = inferSkillsFromCustomRole(customRole);
    }

    if (!jobRole) {
      return res.status(404).json({ error: 'Job role not found' });
    }

    // 2️⃣ Fetch user's latest extracted skills (NOT resume text)
    const resumeResult = await req.db.query(
      `SELECT extracted_skills
       FROM resumes
       WHERE user_id = $1
       ORDER BY upload_date DESC, id DESC
       LIMIT 1`,
      [req.user.userId]
    );

    if (resumeResult.rows.length === 0) {
      return res.status(400).json({ error: 'No resume found for user' });
    }

    const extractedSkills = resumeResult.rows[0].extracted_skills || [];
    console.log("🧠 Using stored extracted skills:", extractedSkills);

    // 3️⃣ Skill Gap Analysis
    const { matchedSkills, missingSkills, extraSkills } =
      analyzeSkillGap(extractedSkills, requiredSkills);

    console.log("📊 Matched:", matchedSkills);
    console.log("⚠️ Missing:", missingSkills);
    console.log("✨ Extra:", extraSkills);

    // 4️⃣ Match percentage
    const matchPercentage = requiredSkills.length > 0
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 0;

    // 5️⃣ Save analysis
    try {
      await req.db.query(
        `
        INSERT INTO skill_gap_analysis
        (user_id, job_role_id, matched_skills, missing_skills, match_percentage)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          req.user.userId,
          jobRoleId,
          matchedSkills,
          missingSkills,
          matchPercentage
        ]
      );
    } catch (err) {
      console.error('Error saving analysis (non-blocking):', err);
    }

    // 6️⃣ Response
    res.json({
      jobRole: {
        id: jobRole.id,
        title: jobRole.title
      },
      analysis: {
        matchedSkills,
        missingSkills,
        extraSkills,
        matchPercentage,
        totalSkillsRequired: requiredSkills.length,
        skillsMatched: matchedSkills.length
      }
    });

  } catch (error) {
    console.error('Gap analysis error:', error);
    res.status(500).json({ error: 'Failed to perform gap analysis' });
  }
}));

// ================================
// GET: Analysis History
// ================================
router.get('/history', verifyToken, asyncHandler(async (req, res) => {
  try {
    const result = await req.db.query(
      `
      SELECT
        sga.id,
        jr.title AS job_role_title,
        sga.matched_skills,
        sga.missing_skills,
        sga.match_percentage,
        sga.analysis_date
      FROM skill_gap_analysis sga
      JOIN job_roles jr ON sga.job_role_id = jr.id
      WHERE sga.user_id = $1
      ORDER BY sga.analysis_date DESC
      LIMIT 10
      `,
      [req.user.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch analysis history' });
  }
}));

// ================================
// POST: Generate Roadmap
// ================================
router.post('/roadmap', verifyToken, asyncHandler(async (req, res) => {
  const { missingSkills, durationWeeks } = req.body;

  if (!missingSkills || !Array.isArray(missingSkills)) {
    return res.status(400).json({ error: 'Missing skills array is required' });
  }

  try {
    const roadmap = generateRoadmap(missingSkills, durationWeeks || 4);
    res.json({ roadmap });
  } catch (error) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
}));

module.exports = router;
