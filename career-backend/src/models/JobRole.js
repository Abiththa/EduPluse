const mongoose = require("mongoose");

const requiredSkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    minLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
  },
  { _id: false }
);

const jobRoleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    linkedCareerRoleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareerRole",
      default: null,
    },
    requiredSkills: [requiredSkillSchema],
    keywords: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("JobRole", jobRoleSchema);