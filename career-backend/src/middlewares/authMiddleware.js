const authMiddleware = (req, res, next) => {
  const authMode = process.env.AUTH_MODE || "mock";

  if (authMode === "mock") {
    req.user = {
      id: process.env.SEED_USER_ID || "student123",
      role: process.env.SEED_ROLE || "student",
    };
    return next();
  }

  return res.status(501).json({
    message: "JWT auth not implemented yet",
  });
};

module.exports = authMiddleware;