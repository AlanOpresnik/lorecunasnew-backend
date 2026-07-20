const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");
const requireAdmin = require("../../authMiddleware");

router.post("/login", login);

router.get("/me", requireAdmin, (req, res) => {
  res.json({
    authenticated: true,
    user: req.user,
  });
});

module.exports = router; 