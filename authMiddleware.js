const jwt = require("jsonwebtoken");

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization; // "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Token faltante",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.role !== "admin") {
      return res.status(403).json({
        error: "No autorizado",
      });
    }

    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Token inválido o expirado",
    });
  }
}

module.exports = requireAdmin;