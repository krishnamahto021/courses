module.exports.checkSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.user.role !== 1) {
    return res
      .status(403)
      .json({ error: "Forbidden: Only super admins are allowed" });
  }

  next();
};
