const mongoose = require("mongoose");

const questionnaireSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // one questionnaire per user
  },
  sleepPattern: {
    type: String,
    enum: ["Deep", "Interrupted", "Light"],
    required: true,
  },
  digestion: {
    type: String,
    enum: ["Strong", "Variable", "Weak"],
    required: true,
  },
  appetite: {
    type: String,
    enum: ["High", "Moderate", "Low"],
    required: true,
  },
  bodyTemperature: {
    type: String,
    enum: ["Warm", "Neutral", "Cold"],
    required: true,
  },
  stressHandling: {
    type: String,
    enum: ["Calm", "Reactive", "Anxious"],
    required: true,
  },
  foodCravings: {
    type: String,
    enum: ["Spicy", "Sweet", "Salty", "Sour", "Bitter"],
    required: true,
  },
  energyLevel: {
    type: String,
    enum: ["High", "Moderate", "Low"],
    required: true,
  },
  additionalNotes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Questionnaire", questionnaireSchema);
