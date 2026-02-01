/**
 * Skill Gap Analysis Utility
 * 
 * Compares extracted resume skills against job role requirements.
 */

/**
 * Analyzes the gap between possessed skills (resume) and required skills (job role).
 * 
 * @param {string[]} resumeSkills - Array of skills extracted from the resume
 * @param {string[]} jobRoleSkills - Array of required skills for the job role
 * @returns {Object} - { matchedSkills, missingSkills, extraSkills }
 */
const analyzeSkillGap = (resumeSkills = [], jobRoleSkills = []) => {
    // 1. Normalize helper
    const normalize = (s) => (typeof s === 'string' ? s.toLowerCase().trim() : '');

    // 2. Normalize arrays
    const normalizedResume = resumeSkills.map(normalize).filter(s => s.length > 0);
    const normalizedRequired = jobRoleSkills.map(normalize).filter(s => s.length > 0);

    console.log("Normalized extracted:", normalizedResume);
    console.log("Normalized required:", normalizedRequired);

    // 3. Filter using includes method
    const matchedSkills = normalizedRequired.filter(skill =>
        normalizedResume.includes(skill)
    );

    const missingSkills = normalizedRequired.filter(skill =>
        !normalizedResume.includes(skill)
    );

    const extraSkills = normalizedResume.filter(skill =>
        !normalizedRequired.includes(skill)
    );

    return {
        matchedSkills: [...new Set(matchedSkills)],
        missingSkills: [...new Set(missingSkills)],
        extraSkills: [...new Set(extraSkills)]
    };
};

module.exports = { analyzeSkillGap };
