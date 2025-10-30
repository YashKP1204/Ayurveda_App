const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:           { type: Date, default: Date.now, required: true },
  doshaResult:    { type: Object, required: true }, // e.g., { dominant: "Pitta", breakdown: {...} }
  bodyType:       { type: String },
  summary:        { type: String },
  recommendations:{ type: Object }, // e.g., { dos: [], donts: [], food: [], lifestyle: [] }
  createdAt:      { type: Date, default: Date.now },
  updatedAt:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', analysisSchema);
