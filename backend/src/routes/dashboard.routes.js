const express = require("express");
const { getDashboardHistory } = require("../controllers/dashboard.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/history", verifyToken, getDashboardHistory);

module.exports = router;
