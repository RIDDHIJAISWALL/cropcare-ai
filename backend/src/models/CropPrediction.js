const mongoose = require('mongoose');

const cropPredictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  soilData: {
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    ph: Number,
  },
  weatherData: {
    temperature: Number,
    humidity: Number,
    rainfall: Number,
  },
  predictedCrop: {
    type: String,
    required: true
  },
  confidenceScore: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CropPrediction', cropPredictionSchema);
