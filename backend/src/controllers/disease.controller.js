const axios = require("axios");
const DiseasePrediction = require("../models/DiseasePrediction");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

async function predictDisease(req, res) {
  try {
    // 1. Get base64 string and plant name from request body
    const { image, plantName } = req.body;
    if (!image || !plantName) {
      return res.status(400).json({ error: "Image and Plant Name are required." });
    }

    // 2. Forward to Python ML Service
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict-disease`, {
      image_base64: image,
      plant_name: plantName
    });

    const { disease_name, confidence, remedies } = mlResponse.data;

    // 3. Save purely text data to MongoDB (Discarding image)
    const prediction = await DiseasePrediction.create({
      user: req.user.id,
      plantName,
      diseaseName: disease_name,
      confidenceScore: confidence,
      remedies
    });

    // 4. Return to frontend
    res.json({
      plantName,
      disease: disease_name,
      confidenceScore: confidence,
      remedies,
      message: "Analysis saved successfully",
    });
  } catch (err) {
    console.error("Disease prediction error:", err.message);
    res.status(500).json({ error: "Failed to analyze plant disease." });
  }
}

module.exports = { predictDisease };
