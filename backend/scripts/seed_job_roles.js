require('dotenv').config({ path: '../.env' }); // Adjust path to .env
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'skill_gap_analyzer',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
});

const seedDataPath = path.join(__dirname, '../data/job_roles_seed.json');

async function seedJobRoles() {
    try {
        console.log("🌱 Starting Job Role Seeding...");

        // 1. Ensure 'domain' column exists
        console.log("🔧 Checking schema...");
        await pool.query(`
            ALTER TABLE job_roles 
            ADD COLUMN IF NOT EXISTS domain VARCHAR(100) DEFAULT 'General';
        `);

        // 2. Read Seed Data
        const rawData = fs.readFileSync(seedDataPath);
        const domainsData = JSON.parse(rawData);

        // 3. Upsert Roles
        for (const domainGroup of domainsData) {
            const domain = domainGroup.domain;
            console.log(`📂 Processing Domain: ${domain}`);

            for (const role of domainGroup.roles) {
                // Check if role exists
                const existing = await pool.query('SELECT id FROM job_roles WHERE title = $1', [role.title]);

                if (existing.rows.length > 0) {
                    // Update
                    await pool.query(
                        `UPDATE job_roles 
                         SET description = $1, required_skills = $2, experience_level = $3, salary_range = $4, domain = $5
                         WHERE title = $6`,
                        [role.description, role.required_skills, role.experience_level, role.salary_range, domain, role.title]
                    );
                    console.log(`   🔄 Updated: ${role.title}`);
                } else {
                    // Insert
                    await pool.query(
                        `INSERT INTO job_roles (title, description, required_skills, experience_level, salary_range, domain)
                         VALUES ($1, $2, $3, $4, $5, $6)`,
                        [role.title, role.description, role.required_skills, role.experience_level, role.salary_range, domain]
                    );
                    console.log(`   ✅ Created: ${role.title}`);
                }
            }
        }

        console.log("🎉 Seeding Completed Successfully!");
    } catch (err) {
        console.error("❌ Seeding Failed:", err);
    } finally {
        await pool.end();
    }
}

seedJobRoles();
