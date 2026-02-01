const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken, asyncHandler } = require('../middleware/auth');

console.log('✅ auth routes loaded');
console.log(`🔑 [Routes] process.env.JWT_SECRET: ${process.env.JWT_SECRET ? (process.env.JWT_SECRET.substring(0, 5) + '...') : 'UNDEFINED'}`);

/* ===============================
   REGISTER
================================ */
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const existing = await req.db.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existing.rows.length > 0) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const hash = await bcrypt.hash(password, 10);

  const userResult = await req.db.query(
    `
    INSERT INTO users (email, password_hash, first_name, last_name)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, first_name
    `,
    [email, hash, firstName, lastName || '']
  );

  const user = userResult.rows[0];

  await req.db.query(
    'INSERT INTO user_profiles (user_id) VALUES ($1)',
    [user.id]
  );

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name
    }
  });
}));

/* ===============================
   LOGIN
================================ */
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await req.db.query(
    'SELECT id, email, password_hash, first_name FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('❌ [Auth] Cannot sign token: JWT_SECRET is missing');
    return res.status(500).json({ error: 'Server authentication configuration error' });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name
    }
  });
}));

/* ===============================
   GET PROFILE
================================ */
router.get('/profile', verifyToken, asyncHandler(async (req, res) => {
  console.log('✅ GET /api/auth/profile HIT');

  const result = await req.db.query(
    `
    SELECT
      u.first_name,
      u.last_name,
      p.phone,
      p.bio,
      p.experience_level,
      p.target_role
    FROM users u
    LEFT JOIN user_profiles p ON u.id = p.user_id
    WHERE u.id = $1
    `,
    [req.user.userId]
  );

  res.json(result.rows[0] || {});
}));

/* ===============================
   UPDATE PROFILE
================================ */
router.put('/profile', verifyToken, asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    bio,
    experienceLevel,
    targetRole
  } = req.body;

  await req.db.query(
    `
    INSERT INTO user_profiles
    (user_id, phone, bio, experience_level, target_role)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (user_id)
    DO UPDATE SET
      phone = EXCLUDED.phone,
      bio = EXCLUDED.bio,
      experience_level = EXCLUDED.experience_level,
      target_role = EXCLUDED.target_role
    `,
    [
      req.user.userId,
      phone,
      bio,
      experienceLevel,
      targetRole
    ]
  );

  await req.db.query(
    `
    UPDATE users
    SET first_name = $1, last_name = $2
    WHERE id = $3
    `,
    [firstName, lastName, req.user.userId]
  );

  res.json({ message: 'Profile updated successfully' });
}));

module.exports = router;
