const express = require("express");
const   router = express.Router();
const {
  getStats,
  createOrUpdateStats,
  syncStatsFromWebhook,
} = require("../controllers/StastController");
const requireAdmin = require("../../authMiddleware");

router.get("/",requireAdmin, getStats);
router.post("/", requireAdmin,createOrUpdateStats);
router.post("/sync",requireAdmin, syncStatsFromWebhook);

module.exports = router;
