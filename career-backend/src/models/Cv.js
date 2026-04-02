const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CvTemplate",
      required: true,
    },
    data: {
      personal: {
        fullName: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
        portfolio: { type: String, default: "" },
      },
      summary: {
        type: String,
        default: "",
      },
      education: [
        {
          institution: { type: String, default: "" },
          degree: { type: String, default: "" },
          fieldOfStudy: { type: String, default: "" },
          startDate: { type: String, default: "" },
          endDate: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
      experience: [
        {
          company: { type: String, default: "" },
          jobTitle: { type: String, default: "" },
          startDate: { type: String, default: "" },
          endDate: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
      projects: [
        {
          title: { type: String, default: "" },
          description: { type: String, default: "" },
          link: { type: String, default: "" },
          technologies: [{ type: String }],
        },
      ],
      skills: [{ type: String }],
      links: [
        {
          label: { type: String, default: "" },
          url: { type: String, default: "" },
        },
      ],
    },
    status: {
      type: String,
      enum: ["draft", "final"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cv", cvSchema);