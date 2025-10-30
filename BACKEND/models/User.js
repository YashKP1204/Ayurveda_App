const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  cognitoId:      { type: String, unique: true}, // AWS Cognito identifier
  name:           { type: String },
  email:          { type: String, required: true ,unique: true},
  age:            { type: Number },
  gender:         { type: String },
  height:         { type: Number },     // e.g., in cm
  weight:         { type: Number },     // e.g., in kg
  physicalAttributes:
   {
  skinType: String,
  bodyBuild: String,
  hairType: String,
  eyeColor: String,
  voice: String,
  appetite: String,
  thirst: String,
  sweating: String,
  bowelMovements: String,
  sleepDuration: String 
   }, // e.g., { skinType, digestion, etc. }
  biologicalAttributes: { 
  pulseRate: String,
  digestion: String,
  sleepQuality: String,
  stressLevels: String,
  energyLevel: String,
  immunity: String,
  cravings: String,
  painSensitivity: String
   }, 
   // e.g., { pulse, sleep, etc. }
  analysisResult:{ type:mongoose.Schema.Types.ObjectId, ref: 'Analysis' } , // Reference to Analysis model
  createdAt:      { type: Date, default: Date.now },
  updatedAt:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
