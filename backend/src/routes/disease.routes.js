const express = require("express");
const { predictDisease } = require("../controllers/disease.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", verifyToken, predictDisease);

module.exports = router;
