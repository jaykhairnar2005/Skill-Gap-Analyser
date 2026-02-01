const { analyzeSkillGap } = require('./skillGapAnalyzer');

console.log("--- Testing Skill Gap Normalization ---");

// Test Case 1: Case Mismatch
const resumeSkills1 = ["Python", "Pandas", "NumPy", " Machine Learning "];
const requiredSkills1 = ["python", "pandas", "numpy", "machine learning"];

console.log("\nTest 1: Case & Whitespace Mismatch");
const result1 = analyzeSkillGap(resumeSkills1, requiredSkills1);
console.log("Matched:", result1.matchedSkills);
console.log("Missing:", result1.missingSkills);

if (result1.missingSkills.length === 0 && result1.matchedSkills.length === 4) {
    console.log("✅ Test 1 Passed");
} else {
    console.error("❌ Test 1 Failed");
}


// Test Case 2: Mixed Case Requirements
const resumeSkills2 = ["python", "react"];
const requiredSkills2 = ["Python", "React", "Node.js"];

console.log("\nTest 2: Mixed Case Requirements");
const result2 = analyzeSkillGap(resumeSkills2, requiredSkills2);
console.log("Matched:", result2.matchedSkills);
console.log("Missing:", result2.missingSkills);

if (result2.matchedSkills.includes("python") && result2.matchedSkills.includes("react") && result2.missingSkills.includes("node.js")) {
    console.log("✅ Test 2 Passed");
} else {
    console.error("❌ Test 2 Failed");
}
