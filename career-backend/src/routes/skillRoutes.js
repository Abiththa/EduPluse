const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");

const router = express.Router();

router.get("/", authMiddleware, getSkills);
router.post("/", authMiddleware, createSkill);
router.put("/:id", authMiddleware, updateSkill);
router.delete("/:id", authMiddleware, deleteSkill);

module.exports = router;