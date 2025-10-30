const Analysis = require('../models/Analysis');
const User = require('../models/User');

// POST /api/analysis - Submit user questionnaire and store analysis
exports.createAnalysis = async (req, res) => {
  try {
    const { userId, doshaResult, bodyType, summary, recommendations } = req.body;

    // Optionally, ensure user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const analysis = new Analysis({
      userId,
      doshaResult,
      bodyType,
      summary,
      recommendations
    });

    await analysis.save();
    res.status(201).json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/analysis/history - Get all analyses for a user
exports.getAnalysisHistory = async (req, res) => {
  try {
    const userId = req.query.userId; // or req.user.id if using JWT auth

    const analyses = await Analysis.find({ userId }).sort({ date: -1 });
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/analysis/:id - Get a single analysis record
exports.getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await Analysis.findById(id);

    if (!analysis) return res.status(404).json({ message: 'Analysis not found' });
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
