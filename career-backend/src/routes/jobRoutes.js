const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getJobSuggestions } = require("../controllers/jobController");

const router = express.Router();

router.get("/suggestions", authMiddleware, getJobSuggestions);

module.exports = router;