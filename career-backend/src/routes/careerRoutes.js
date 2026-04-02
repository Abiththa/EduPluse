const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getCareerRoles,
  getCareerRoadmapByRoleId,
  getRoadmapProgress,
  updateRoadmapProgress,
} = require("../controllers/careerController");

const router = express.Router();

router.get("/", authMiddleware, getCareerRoles);
router.get("/:id/roadmap", authMiddleware, getCareerRoadmapByRoleId);
router.get("/:id/progress", authMiddleware, getRoadmapProgress);
router.put("/:id/progress", authMiddleware, updateRoadmapProgress);

module.exports = router;