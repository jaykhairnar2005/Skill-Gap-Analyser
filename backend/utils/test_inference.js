const { inferSkillsFromCustomRole } = require('./customRoleSkillInferencer');

const rolesToTest = [
    "Cyber Security Analyst",
    "Blockchain Developer",
    "Game Programmer",
    "AI Research Scientist",
    "Generic Software Dev"
];

console.log("--- Testing Custom Role Skill Inference ---");

rolesToTest.forEach(role => {
    const skills = inferSkillsFromCustomRole(role);
    console.log(`\nRole: "${role}"`);
    console.log(`Inferrred Skills: [ ${skills.join(', ')} ]`);

    // Simple assertion check
    if (role.includes("Cyber") && !skills.includes("penetration testing")) {
        console.error("❌ FAILED: Cyber role missing penetration testing");
    } else if (role.includes("Blockchain") && !skills.includes("solidity")) {
        console.error("❌ FAILED: Blockchain role missing solidity");
    } else {
        console.log("✅ Check Passed");
    }
});
