const express = require("express");
const router = express.Router();
const { submitQuestionnaire, getUserQuestionnaire } = require("../controllers/QuestionnareController");
const authenticateJWT = require('../middleware/authenticateJWT');


// Route to submit or update questionnaire
router.post("/",authenticateJWT, submitQuestionnaire);

// Route to get questionnaire
router.get("/",authenticateJWT, getUserQuestionnaire);

module.exports = router;
