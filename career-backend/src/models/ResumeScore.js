const mongoose = require("mongoose");

const resumeScoreSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    cvId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cv",
      required: true,
    },
    targetRoleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobRole",
      default: null,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    missingKeywords: [{ type: String }],
    suggestions: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ResumeScore", resumeScoreSchema);