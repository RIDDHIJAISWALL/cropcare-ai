const CropPrediction = require("../models/CropPrediction");
const DiseasePrediction = require("../models/DiseasePrediction");

async function getDashboardHistory(req, res) {
  try {
    const userId = req.user.id;

    // Fetch both collections
    const crops = await CropPrediction.find({ user: userId }).lean();
    const diseases = await DiseasePrediction.find({ user: userId }).lean();

    // Map and combine
    const cropHistory = crops.map(c => ({
      id: c._id,
      type: "crop",
      result: c.predictedCrop,
      confidenceScore: c.confidenceScore,
      details: `N:${c.soilData.nitrogen}, P:${c.soilData.phosphorus}, K:${c.soilData.potassium}, pH:${c.soilData.ph}`,
      createdAt: c.createdAt
    }));

    const diseaseHistory = diseases.map(d => ({
      id: d._id,
      type: "disease",
      plantName: d.plantName,
      result: d.diseaseName,
      confidenceScore: d.confidenceScore,
      remedies: d.remedies,
      createdAt: d.createdAt
    }));

    // Merge and sort by newest first
    const history = [...cropHistory, ...diseaseHistory].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ history });
  } catch (err) {
    console.error("Dashboard history error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard history." });
  }
}

module.exports = { getDashboardHistory };
