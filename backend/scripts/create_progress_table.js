require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'skill_gap_analyzer',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
});

const createTable = async () => {
    try {
        console.log('⏳ Creating user_skill_progress table...');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS user_skill_progress (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                skill_name VARCHAR(255) NOT NULL,
                status VARCHAR(50) DEFAULT 'completed',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, skill_name)
            );
        `);

        console.log('✅ Table user_skill_progress created successfully!');
    } catch (error) {
        console.error('❌ Error creating table:', error);
    } finally {
        pool.end();
    }
};

createTable();
