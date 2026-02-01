/**
 * Skill Extraction Utility
 * 
 * Extracts valid technical skills from resume text based on a predefined dictionary.
 */

// Predefined dictionary of common technical skills
// Normalized to lowercase for easier matching, but with display case for returning
const SKILL_DICTIONARY = {
    'java': 'Java',
    'python': 'Python',
    'c++': 'C++',
    'cpp': 'C++',
    'javascript': 'JavaScript',
    'js': 'JavaScript',
    'react': 'React',
    'react.js': 'React',
    'reactjs': 'React',
    'node': 'Node.js',
    'node.js': 'Node.js',
    'nodejs': 'Node.js',
    'express': 'Express',
    'express.js': 'Express',
    'sql': 'SQL',
    'mysql': 'MySQL',
    'postgresql': 'PostgreSQL',
    'postgres': 'PostgreSQL',
    'mongodb': 'MongoDB',
    'mongo': 'MongoDB',
    'html': 'HTML',
    'html5': 'HTML',
    'css': 'CSS',
    'css3': 'CSS',
    'docker': 'Docker',
    'git': 'Git',
    'aws': 'AWS',
    'typescript': 'TypeScript',
    'ts': 'TypeScript',
    'angular': 'Angular',
    'vue': 'Vue.js',
    'vue.js': 'Vue.js',
    'django': 'Django',
    'flask': 'Flask',
    'spring': 'Spring',
    'spring boot': 'Spring Boot',
    'kubernetes': 'Kubernetes',
    'k8s': 'Kubernetes',
    'jenkins': 'Jenkins',
    'linux': 'Linux',
    'unix': 'Unix',
    'azure': 'Azure',
    'gcp': 'Google Cloud',
    'graphql': 'GraphQL',
    'rest': 'REST API',
    'api': 'REST API'
};

/**
 * Extracts unique technical skills from the provided text.
 * 
 * @param {string} text - The raw text from the resume
 * @returns {string[]} - Array of unique extracted skills
 */
const extractSkills = (text) => {
    if (!text || typeof text !== 'string') {
        return [];
    }

    // 1. Normalize the text
    // Convert to lowercase for case-insensitive matching
    // Replace newlines and multiple spaces with single space
    // Remove special characters that are not part of common skills (allowing . and +)
    // We allow letters, numbers, +, ., # (for C#) and spaces
    const normalizedText = text.toLowerCase()
        .replace(/\ng/, ' ')
        .replace(/[^\w\s\+\.#]/g, ' ')
        .replace(/\s+/g, ' ');

    const foundSkills = new Set();

    // Create an array of potential tokens (words) to check
    // We strictly split by space to avoid matching partial words incorrectly (e.g. "java" in "javascript" if not careful)
    // However, some skills are multi-word (e.g. "spring boot", "node js"). 
    // For simplicity with this dictionary, we can check for existence of keys in the text 
    // or iterate through the dictionary and check if the skill exists in the text.

    // Strategy: Iterate through dictionary keys and check if they exist as whole words in text

    const skillKeys = Object.keys(SKILL_DICTIONARY);

    // We pad the text with spaces to ensure we can match whole words at start/end
    const paddedText = ` ${normalizedText} `;

    skillKeys.forEach(skillKey => {
        // Escape special chars for regex (like + and .)
        const escapedKey = skillKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Check for " key " (surrounded by spaces)
        if (paddedText.includes(` ${skillKey} `)) {
            // RETURN LOWERCASE VALUE
            foundSkills.add(SKILL_DICTIONARY[skillKey].toLowerCase());
        }
    });

    return Array.from(foundSkills);
};

module.exports = { extractSkills };
