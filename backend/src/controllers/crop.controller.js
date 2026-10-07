const axios = require("axios");
const CropPrediction = require("../models/CropPrediction");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

async function predictCrop(req, res) {
  try {
    const { nitrogen, phosphorus, potassium, ph, temperature, humidity, rainfall } = req.body;

    // Send to Python ML Service
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict-crop`, {
      nitrogen,
      phosphorus,
      potassium,
      ph,
      temperature,
      humidity,
      rainfall,
    });

    const predictedCrop = mlResponse.data.crop;
    const confidenceScore = mlResponse.data.confidence || 95; // default fallback if ML doesn't send

    // Save to MongoDB
    const prediction = await CropPrediction.create({
      user: req.user.id,
      soilData: { nitrogen, phosphorus, potassium, ph },
      weatherData: { temperature, humidity, rainfall },
      predictedCrop,
      confidenceScore
    });

    res.json({
      crop: predictedCrop,
      confidenceScore,
      message: "Prediction saved successfully",
    });
  } catch (err) {
    console.error("Crop prediction error:", err.message);
    res.status(500).json({ error: "Failed to get crop recommendation." });
  }
}

module.exports = { predictCrop };
