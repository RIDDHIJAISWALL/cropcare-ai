const User = require("../models/User");
const CropPrediction = require("../models/CropPrediction");
const DiseasePrediction = require("../models/DiseasePrediction");

// ─── Get All Farmers ─────────────────────────────────────────
async function getAllFarmers(req, res) {
  try {
    const farmers = await User.find({ role: 'Farmer' }).select('-password');
    res.json({ users: farmers });
  } catch (err) {
    console.error("Fetch farmers error:", err);
    res.status(500).json({ error: "Failed to fetch farmers." });
  }
}

// ─── Delete Farmer ───────────────────────────────────────────
async function deleteFarmer(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found." });

    // Optional: Delete their history too
    await CropPrediction.deleteMany({ user: id });
    await DiseasePrediction.deleteMany({ user: id });
    await User.findByIdAndDelete(id);

    res.json({ message: "Farmer and all related data deleted successfully." });
  } catch (err) {
    console.error("Delete farmer error:", err);
    res.status(500).json({ error: "Failed to delete farmer." });
  }
}

module.exports = { getAllFarmers, deleteFarmer };
