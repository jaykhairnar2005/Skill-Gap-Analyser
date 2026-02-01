require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'skill_gap_analyzer',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
});

async function verifyJobRoles() {
    try {
        console.log("🔍 Verifying Job Roles Configuration...");

        const result = await pool.query('SELECT title, domain FROM job_roles LIMIT 5');

        if (result.rows.length === 0) {
            console.error("❌ No job roles found!");
        } else {
            console.log("✅ Job Roles Found:", result.rows.length);

            const hasDomain = result.rows.every(r => r.domain);
            if (hasDomain) {
                console.log("✅ Domain field is present and populated.");
                result.rows.forEach(r => console.log(`   - ${r.title} [${r.domain}]`));
            } else {
                console.error("❌ Some roles are missing the domain field.");
            }
        }
    } catch (err) {
        console.error("❌ Verification Failed:", err);
    } finally {
        await pool.end();
    }
}

verifyJobRoles();
