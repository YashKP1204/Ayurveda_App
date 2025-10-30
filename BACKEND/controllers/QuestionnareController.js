const Questionnaire = require("../models/Questionnare");
const User = require("../models/User");

// @desc    Submit or update questionnaire answers
// @route   POST /api/questionnaire
// @access  Private
const submitQuestionnaire = async (req, res) => {
  try {
    console.log("Received questionnaire submission request");
    console.log("User info from request:", req.user);
    const cognitoId = req.user.sub; // adjust depending on Cognito payload
    const user = await User.findOne({ cognitoId });
    console.log("User found:", user);


    const {
      sleepPattern,
      digestion,
      appetite,
      bodyTemperature,
      stressHandling,
      foodCravings,
      energyLevel,
      additionalNotes,
    } = req.body;

    // Check if user already submitted questionnaire
    let questionnaire = await Questionnaire.findOne({ userId:user._id });
    console.log("Existing questionnaire found:", questionnaire);

    if (questionnaire) {
      // Update existing
      questionnaire.set({
        sleepPattern,
        digestion,
        appetite,
        bodyTemperature,
        stressHandling,
        foodCravings,
        energyLevel,
        additionalNotes,
      });
      await questionnaire.save();
      console.log("Questionnaire updated:", questionnaire);
      return res.status(200).json({ message: "Questionnaire updated", data: questionnaire });
    }

    // Else, create new entry
    console.log("Creating new questionnaire for user:",user._id);
    questionnaire = await Questionnaire.create({
      userId:user._id,
      sleepPattern,
      digestion,
      appetite,
      bodyTemperature,
      stressHandling,
      foodCravings,
      energyLevel,
      additionalNotes,
    });
    console.log("New questionnaire created:", questionnaire);

    res.status(201).json({ message: "Questionnaire submitted", data: questionnaire });
  } catch (error) {
    console.error("Error in questionnaire submission:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user’s questionnaire
// @route   GET /api/questionnaire
// @access  Private
const getUserQuestionnaire = async (req, res) => {
  try {
    console.log("Received request to get user questionnaire");
    const userId = req.user.sub ;
    const user = await User.findOne({ cognitoId: userId });

    const questionnaire = await Questionnaire.findOne({userId:user._id });

    if (!questionnaire) {
      return res.status(404).json({ message: "No questionnaire found" });
    }

    res.status(200).json({ data: questionnaire });
  } catch (error) {
    console.error("Error getting questionnaire:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  submitQuestionnaire,
  getUserQuestionnaire,
};
