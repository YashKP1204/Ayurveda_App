const axios = require("axios");
const User = require("../models/User");
const Questionnaire = require("../models/Questionnare");
const Analysis = require("../models/Analysis");

const getDoshaAnalysis = async (req, res) => {
  try {
    console.log("Received request for dosha analysis");

    const userId = req.user.sub;
    const user = await User.findOne({ cognitoId: userId });
    const questionnaire = await Questionnaire.findOne({ userId: user?._id });

    if (!user || !questionnaire) {
      return res.status(404).json({ message: "User profile or questionnaire not found." });
    }

    const prompt = `
You are an expert Ayurvedic practitioner. Based on the following user profile and questionnaire, determine the user's primary Dosha (Vata, Pitta, Kapha), any possible imbalances, and provide personalized recommendations.

Please return the result strictly in this JSON format:

{
  "doshaResult": {
    "dominant": "Pitta",
    "characteristics": [ "string", "..." ],
    "imbalances": [ "string", "..." ]
  },
  "summary": "Short paragraph summary of the user's dosha and condition.",
  "bodyType": "Optional body type string (if available from input)",
  "recommendations": {
    "diet": [ "string", "..." ],
    "lifestyle": [ "string", "..." ]
  }
}

User Profile:
- Name: ${user.name || "Unknown"}
- Age: ${user.age}
- Gender: ${user.gender}
- Skin Type: ${user.physicalAttributes?.skinType}
- Digestion: ${user.biologicalAttributes?.digestion}
- Stress Level: ${user.biologicalAttributes?.stressLevels}

Questionnaire Responses:
${JSON.stringify(questionnaire.answers, null, 2)}
    `.trim();

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an Ayurveda expert helping users understand their Dosha imbalances.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AyurvedaDoshaApp"
        },
      }
    );

    const rawContent = response.data.choices[0].message.content;
    console.log("Raw ChatGPT Response:", rawContent);

    // Safely parse JSON
    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (parseErr) {
      return res.status(500).json({ message: "AI response was not valid JSON", raw: rawContent });
    }

    // Save analysis to new collection
    const newAnalysis = new Analysis({
      userId: user._id,
      doshaResult: parsed.doshaResult,
      summary: parsed.summary,
      bodyType: parsed.bodyType || user.physicalAttributes?.bodyType || "",
      recommendations: parsed.recommendations
    });

    const newAnalysisData = await newAnalysis.save();
    user.analysisResult = newAnalysisData._id;
    await user.save();
    console.log("User analysis result saved:", newAnalysisData);
    console.log("Saved structured analysis to database");

    return res.status(200).json({ analysis: newAnalysis });

  } catch (error) {
    console.error("Dosha analysis error:", error.message);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }

    res.status(500).json({
      message: "An error occurred during dosha analysis",
      details: error.response?.data || error.message
    });
  }
};

const getUserAnalysisHistory = async (req, res) => {
  try {
    const userId = req.user.sub;
    const user = await User.findOne({ cognitoId: userId });
    const analysisHistory = await Analysis.find({ userId: user._id }).populate('userId', 'name email').sort({ createdAt: -1 });
    if (!user || !analysisHistory) {
      return res.status(404).json({ message: "User or analysis history not found."
      });
    }
    res.status(200).json({ analysisHistory });
  } catch (error) {
    console.error("Error fetching analysis history:", error.message);
    res.status(500).json({ message: "An error occurred while fetching analysis history", details: error.message });
  }
}

module.exports = { getDoshaAnalysis ,getUserAnalysisHistory };
