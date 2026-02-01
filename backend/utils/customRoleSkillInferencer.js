/**
 * Custom Role Skill Inferencer
 * 
 * Derives realistic required skills from a custom job role title
 * using keyword matching.
 */

const inferSkillsFromCustomRole = (customRole) => {
    if (!customRole || typeof customRole !== 'string') {
        return ["programming fundamentals", "data structures", "problem solving"];
    }

    const roleLower = customRole.toLowerCase().trim();

    // 1. Cyber Security
    if (roleLower.includes('cyber') || roleLower.includes('security')) {
        return [
            "networking",
            "linux",
            "cryptography",
            "penetration testing",
            "firewalls",
            "ids/ips",
            "siem",
            "web security"
        ];
    }

    // 2. Blockchain
    if (roleLower.includes('blockchain')) {
        return [
            "blockchain fundamentals",
            "solidity",
            "smart contracts",
            "cryptography",
            "web3",
            "ethereum",
            "distributed systems"
        ];
    }

    // 3. Game Development
    if (roleLower.includes('game')) {
        return [
            "unity or unreal engine",
            "c++ or c#",
            "game physics",
            "shaders",
            "3d math",
            "graphics programming"
        ];
    }

    // 4. AI / Machine Learning
    if (roleLower.includes('ai') || roleLower.includes('ml') || roleLower.includes('machine learning') || roleLower.includes('artificial intelligence')) {
        return [
            "python",
            "numpy",
            "pandas",
            "machine learning",
            "deep learning",
            "pytorch or tensorflow",
            "data preprocessing"
        ];
    }

    // Fallback
    return ["programming fundamentals", "data structures", "problem solving"];
};

module.exports = { inferSkillsFromCustomRole };
