const express = require("express");
const { predictCrop } = require("../controllers/crop.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", verifyToken, predictCrop);

module.exports = router;
