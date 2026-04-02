const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const cvRoutes = require("./routes/cvRoutes");
const skillRoutes = require("./routes/skillRoutes");
const careerRoutes = require("./routes/careerRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Career Management Backend API Running" });
});

app.use("/api/cv", cvRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;