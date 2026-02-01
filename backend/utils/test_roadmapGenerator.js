const { generateRoadmap } = require('./roadmapGenerator');

const missingSkills = ['docker', 'react', 'leadership']; // Added skills with dynamic resources
const duration = 3;

console.log('--- Testing Rich Roadmap Generator ---');
const roadmap = generateRoadmap(missingSkills, duration);

console.log(JSON.stringify(roadmap, null, 2));

// Check if keys exist
if (roadmap.length > 0 && roadmap[0].topics && roadmap[0].resources) {
    console.log("✅ Verification SUCCESS: Rich metadata found in output.");
} else {
    console.error("❌ Verification FAILED: Missing topics or resources.");
}
