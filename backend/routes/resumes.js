const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfjsLib = require('pdfjs-dist');
const { verifyToken, asyncHandler } = require('../middleware/auth');

/* ===============================
   MULTER CONFIG
================================ */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        file.mimetype === 'application/pdf'
            ? cb(null, true)
            : cb(new Error('Only PDF files allowed'));
    }
});

/* ===============================
   PDF TEXT EXTRACTION
================================ */
async function extractTextFromPDF(filePath) {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(i => i.str).join(' ') + ' ';
    }
    return text.toLowerCase();
}

/* ===============================
   SKILL EXTRACTION (EXPANDED)
================================ */
function extractSkillsFromText(text) {
    const skills = [
        'python', 'java', 'javascript',
        'react', 'node', 'node.js', 'express',
        'html', 'css',
        'sql', 'postgresql', 'mongodb',
        'pandas', 'numpy', 'scikit-learn',
        'machine learning', 'statistics',
        'aws', 'docker', 'kubernetes', 'linux',
        'git', 'ci/cd', 'devops'
    ];

    const found = new Set();
    skills.forEach(skill => {
        if (text.includes(skill)) {
            found.add(skill);
        }
    });

    return [...found];
}

/* ===============================
   UPLOAD RESUME (FIXED)
================================ */
router.post(
    '/upload',
    verifyToken,
    upload.single('resume'),
    asyncHandler(async (req, res) => {

        const extractedText = await extractTextFromPDF(req.file.path);
        const extractedSkills = extractSkillsFromText(extractedText);

        console.log('🧠 Extracted:', extractedSkills);

        const result = await req.db.query(
            `
            INSERT INTO resumes
            (user_id, file_name, file_path, extracted_skills, extracted_text)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
            `,
            [
                req.user.userId,
                req.file.originalname,
                req.file.path,
                extractedSkills,
                extractedText
            ]
        );

        /* ===============================
           🔥 CORE FIX: SKILL INSERT
        ================================ */
        for (const skill of extractedSkills) {
            const skillLower = skill.toLowerCase();

            let skillRow = await req.db.query(
                'SELECT id FROM skills WHERE LOWER(name) = $1',
                [skillLower]
            );

            let skillId;

            // ❗ CREATE SKILL IF NOT EXISTS
            if (skillRow.rows.length === 0) {
                const inserted = await req.db.query(
                    'INSERT INTO skills (name) VALUES ($1) RETURNING id',
                    [skill]
                );
                skillId = inserted.rows[0].id;
            } else {
                skillId = skillRow.rows[0].id;
            }

            // LINK SKILL TO USER
            await req.db.query(
                `
                INSERT INTO user_skills (user_id, skill_id, proficiency_level)
                VALUES ($1, $2, 'intermediate')
                ON CONFLICT (user_id, skill_id) DO NOTHING
                `,
                [req.user.userId, skillId]
            );
        }

        res.status(201).json({
            message: 'Resume uploaded successfully',
            extractedSkills
        });
    })
);

/* ===============================
   GET USER RESUMES
================================ */
router.get('/', verifyToken, asyncHandler(async (req, res) => {
    const r = await req.db.query(
        'SELECT id, file_name, extracted_skills FROM resumes WHERE user_id=$1',
        [req.user.userId]
    );
    res.json(r.rows);
}));

module.exports = router;
