const express = require("express");
const { getAllFarmers, deleteFarmer } = require("../controllers/admin.controller");
const { verifyAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/users", verifyAdmin, getAllFarmers);
router.delete("/users/:id", verifyAdmin, deleteFarmer);

module.exports = router;
