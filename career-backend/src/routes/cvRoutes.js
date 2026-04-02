const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllCvs,
  getCvById,
  createCv,
  updateCv,
  deleteCv,
  getCvTemplates,
  downloadCvPdf,
} = require("../controllers/cvController");

const router = express.Router();

router.get("/templates", authMiddleware, getCvTemplates);

router.get("/", authMiddleware, getAllCvs);
router.post("/", authMiddleware, createCv);
router.get("/:id", authMiddleware, getCvById);
router.put("/:id", authMiddleware, updateCv);
router.delete("/:id", authMiddleware, deleteCv);
router.get("/:id/download", authMiddleware, downloadCvPdf);

module.exports = router;