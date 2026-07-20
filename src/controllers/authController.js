const ADMIN_USER = process.env.ADMIN_USER; // guardado en .env
const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH; // hash de bcrypt, NO texto plano
const JWT_SECRET = process.env.JWT_SECRET;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USER) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const valid = await bcrypt.compare(password, ADMIN_PASS_HASH);
  if (!valid) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "2h" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    token
  });
};

module.exports = {
  login,
};
