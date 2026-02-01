/**
 * Learning Roadmap Generator
 * 
 * Generates a weekly learning plan based on missing skills and available time.
 */

// Rich Skill Metadata
const { getRecommendedResources } = require('./resourceRecommender');

const SKILL_METADATA = {
    'html': {
        level: 1,
        label: 'HTML5',
        topics: ['Semantic HTML', 'Forms & Validations', 'Accessibility (A11y)', 'SEO Basics'],
        resources: [
            { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
            { name: 'FreeCodeCamp', url: 'https://www.freecodecamp.org/learn/responsive-web-design/' }
        ]
    },
    'css': {
        level: 1,
        label: 'CSS3',
        topics: ['Flexbox & Grid', 'Responsive Design', 'Transitions & Animations', 'CSS Variables'],
        resources: [
            { name: 'CSS Tricks', url: 'https://css-tricks.com/' },
            { name: 'Flexbox Froggy', url: 'https://flexboxfroggy.com/' }
        ]
    },
    'javascript': {
        level: 2,
        label: 'JavaScript',
        topics: ['ES6+ Features', 'Async/Await', 'DOM Manipulation', 'Event Loop', 'Closures'],
        resources: [
            { name: 'javascript.info', url: 'https://javascript.info/' },
            { name: 'Namaste JavaScript (YouTube)', url: 'https://www.youtube.com/watch?v=pN6jk0uapqY' }
        ]
    },
    'react': {
        level: 3,
        label: 'React.js',
        topics: ['Components & Props', 'Hooks (useState, useEffect)', 'Context API', 'React Router', 'State Management'],
        resources: [
            { name: 'React Docs', url: 'https://react.dev/' },
            { name: 'Scrimba React Course', url: 'https://scrimba.com/learn/learnreact' }
        ]
    },
    'node.js': {
        level: 3,
        label: 'Node.js',
        topics: ['Event Loop', 'File System (fs)', 'Streams & Buffers', 'HTTP Module', 'NPM Scripts'],
        resources: [
            { name: 'Node.js Docs', url: 'https://nodejs.org/en/docs/' },
            { name: 'Node.js Crash Course', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4' }
        ]
    },
    'express': {
        level: 3,
        label: 'Express.js',
        topics: ['Middleware', 'Routing', 'Error Handling', 'REST API Design', 'Authentication (JWT)'],
        resources: [
            { name: 'Express Docs', url: 'https://expressjs.com/' },
            { name: 'Traversy Media', url: 'https://www.youtube.com/watch?v=L72fhGm1tfE' }
        ]
    },
    'mongodb': {
        level: 3,
        label: 'MongoDB',
        topics: ['CRUD Operations', 'Aggregation Pipeline', 'Indexing', 'Mongoose ODM', 'Atlas Cloud'],
        resources: [
            { name: 'MongoDB University', url: 'https://learn.mongodb.com/' },
            { name: 'Mongoose Docs', url: 'https://mongoosejs.com/docs/' }
        ]
    },
    'sql': {
        level: 2,
        label: 'SQL',
        topics: ['Joins', 'Normalization', 'Indexes', 'Stored Procedures', 'Transactions'],
        resources: [
            { name: 'W3Schools SQL', url: 'https://www.w3schools.com/sql/' },
            { name: 'SQLBolt', url: 'https://sqlbolt.com/' }
        ]
    },
    'python': {
        level: 2,
        label: 'Python',
        topics: ['Data Structures', 'OOP', 'Decorators', 'Generators', 'Virtual Environments'],
        resources: [
            { name: 'Real Python', url: 'https://realpython.com/' },
            { name: 'Automate the Boring Stuff', url: 'https://automatetheboringstuff.com/' }
        ]
    },
    'docker': {
        level: 4,
        label: 'Docker',
        topics: ['Images vs Containers', 'Dockerfile', 'Docker Compose', 'Volumes & Networks', 'Best Practices'],
        resources: [
            { name: 'Docker Docs', url: 'https://docs.docker.com/get-started/' },
            { name: 'Docker for Beginners', url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo' }
        ]
    },
    'aws': {
        level: 4,
        label: 'AWS',
        topics: ['EC2 & S3', 'Lambda (Serverless)', 'IAM & Security', 'RDS & DynamoDB', 'CloudWatch'],
        resources: [
            { name: 'AWS Free Tier', url: 'https://aws.amazon.com/free/' },
            { name: 'AWS Skill Builder', url: 'https://explore.skillbuilder.aws/' }
        ]
    },
    'git': {
        level: 1,
        label: 'Git & GitHub',
        topics: ['Commit & Push', 'Branching & Merging', 'Pull Requests', 'Resolving Conflicts', 'Git Flow'],
        resources: [
            { name: 'Pro Git Book', url: 'https://git-scm.com/book/en/v2' },
            { name: 'GitHub Skills', url: 'https://skills.github.com/' }
        ]
    },
    'default': {
        level: 2,
        label: 'Skill',
        topics: ['Fundamentals', 'Best Practices', 'Advanced Concepts', 'Real-world Application'],
        resources: [
            { name: 'Google Search', url: 'https://google.com' },
            { name: 'YouTube', url: 'https://youtube.com' }
        ]
    }
};

/**
 * Generates a structured learning roadmap.
 * 
 * @param {string[]} missingSkills - Array of skills to learn
 * @param {number} durationWeeks - Total weeks available for learning
 * @returns {Object[]} - Array of roadmap items
 */
const generateRoadmap = (missingSkills = [], durationWeeks = 4) => {
    if (!missingSkills || missingSkills.length === 0) {
        return [];
    }

    // Ensure duration is at least 1 week
    const weeks = Math.max(1, parseInt(durationWeeks) || 4);

    // 1. Sort skills by difficulty/dependency level
    const sortedSkills = [...missingSkills].sort((a, b) => {
        const skillA = SKILL_METADATA[a.toLowerCase()] || SKILL_METADATA['default'];
        const skillB = SKILL_METADATA[b.toLowerCase()] || SKILL_METADATA['default'];
        return skillA.level - skillB.level;
    });

    const skillsPerWeek = Math.ceil(sortedSkills.length / weeks);
    const roadmap = [];
    let skillIndex = 0;

    for (let w = 1; w <= weeks; w++) {
        // Collect skills for this week
        const weekSkills = [];
        let count = 0;

        while (count < skillsPerWeek && skillIndex < sortedSkills.length) {
            weekSkills.push(sortedSkills[skillIndex]);
            skillIndex++;
            count++;
        }

        if (weekSkills.length > 0) {
            // Aggregate Metadata
            const skillLabels = [];
            const allTopics = [];
            const allResources = [];

            weekSkills.forEach(rawSkill => {
                const key = rawSkill.toLowerCase();
                const meta = SKILL_METADATA[key] || {
                    ...SKILL_METADATA['default'],
                    label: rawSkill.charAt(0).toUpperCase() + rawSkill.slice(1)
                };

                const dynamicResources = getRecommendedResources(key);
                const staticResources = meta.resources || [];

                // Combine and Deduplicate resources based on URL
                const combinedResources = [...staticResources, ...dynamicResources];
                const uniqueResources = Array.from(new Map(combinedResources.map(r => [r.url, r])).values());

                skillLabels.push(meta.label);
                allTopics.push(...(meta.topics || []));
                allResources.push(...uniqueResources);
            });

            // Construct Response Object
            roadmap.push({
                week: w,
                title: `Mastering ${skillLabels[0]} ${skillLabels.length > 1 ? `& ${skillLabels[1]}` : ''}`,
                skills: skillLabels,
                objective: `Focus on the core concepts of ${skillLabels.join(', ')} to build a strong foundation.`,
                topics: [...new Set(allTopics)].slice(0, 6), // Deduplicate and limit
                resources: [...new Set(allResources)].slice(0, 4) // Deduplicate and limit
            });
        }
    }

    return roadmap;
};

module.exports = { generateRoadmap };
