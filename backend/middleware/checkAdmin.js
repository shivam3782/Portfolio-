function checkAdmin(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (!process.env.ADMIN_KEY || !key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

module.exports = checkAdmin;
