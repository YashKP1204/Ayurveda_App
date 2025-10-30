const express = require("express");
const router = express.Router();
const { getDoshaAnalysis ,getUserAnalysisHistory } = require("../controllers/doshaAnalysisController");
const authenticateJWT = require('../middleware/authenticateJWT');

router.get("/", authenticateJWT, getDoshaAnalysis);
router.get("/history", authenticateJWT, getUserAnalysisHistory);

module.exports = router;
