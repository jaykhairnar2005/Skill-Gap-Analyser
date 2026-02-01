const express = require("express");
const router = express.Router();
const axios = require("axios");
const { verifyToken, asyncHandler } = require("../middleware/auth");

async function getWorkingModel(apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const res = await axios.get(url);

  // pick first model that supports generateContent
  const model = res.data.models.find(m =>
    m.supportedGenerationMethods?.includes("generateContent")
  );

  if (!model) throw new Error("No usable Gemini model found");
  return model.name;
}

// ✅ sleep helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ✅ retry helper for quota errors
async function callWithRetry(url, payload, retries = 3) {
  try {
    return await axios.post(url, payload);
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      console.log(`⏳ Gemini quota hit. Retrying in 5s... (${retries} left)`);
      await sleep(5000);
      return callWithRetry(url, payload, retries - 1);
    }
    throw error;
  }
}

router.post(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    try {
      const { message, context } = req.body;
      if (!message) return res.status(400).json({ error: "Message is required" });

      const apiKey = process.env.GEMINI_API_KEY;
      const modelName = await getWorkingModel(apiKey);
      const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;

      // 🔍 Detect Greeting vs. Real Question
      const greetings = ['hi', 'hello', 'hey', 'hii', 'yo', 'thanks', 'ok', 'thank you'];
      const isGreeting = greetings.includes(message.toLowerCase().trim()) || message.length < 4;

      let systemInstruction = "";

      if (isGreeting) {
        systemInstruction =
          "You are a friendly assistant. The user just greeted you. Reply with a short, friendly message (max 2 lines). Ask if they need help with skills, roadmap, or career advice.";
      } else {
        systemInstruction = "You are an expert career mentor and technical interviewer.";

        if (context) {
          const { jobRole, resumeSkills, missingSkills } = context;
          if (jobRole) systemInstruction += ` The user is targeting the role of: ${jobRole}.`;
          if (resumeSkills?.length) systemInstruction += ` Their current skills are: ${resumeSkills.join(", ")}.`;
          if (missingSkills?.length) systemInstruction += ` They are missing the following skills: ${missingSkills.join(", ")}.`;

          systemInstruction += " Use this context to provide personalized advice, learning resources, and interview tips. Be encouraging but realistic.";
        }
      }

      console.log(`🤖 AI Mode: ${isGreeting ? 'Greeting' : 'Mentor'}`);

      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }]
          }
        ]
      };

      // ✅ call Gemini with retry
      const response = await callWithRetry(url, payload, 3);

      const reply =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from AI";

      res.json({ reply });

    } catch (error) {
      console.error("Chat error:", error.response?.data || error.message);

      // ✅ friendly quota message
      if (error.response?.status === 429) {
        return res.json({
          reply: "⚠️ AI is busy right now (quota limit). Please try again in a minute."
        });
      }

      res.status(500).json({ error: "AI failed to respond" });
    }
  })
);

module.exports = router;
