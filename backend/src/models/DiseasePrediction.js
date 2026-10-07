const mongoose = require('mongoose');

const diseasePredictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plantName: {
    type: String,
    required: true
  },
  diseaseName: {
    type: String,
    required: true
  },
  confidenceScore: {
    type: Number
  },
  remedies: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DiseasePrediction', diseasePredictionSchema);
