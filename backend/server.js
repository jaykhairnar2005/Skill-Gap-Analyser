require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Import routes
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resumes');
const analysisRoutes = require('./routes/analysis');
const jobRoleRoutes = require('./routes/jobRoles');
const chatRoutes = require('./routes/chat');
const skillsRoutes = require('./routes/skills');
const roadmapRoutes = require('./routes/roadmap');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ DATABASE CONNECTION (DEPLOYMENT READY)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Make pool accessible to routes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/job-roles', jobRoleRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/roadmap', roadmapRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
