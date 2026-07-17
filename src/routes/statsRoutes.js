const express = require("express");
const   router = express.Router();
const {
  getStats,
  createOrUpdateStats,
  syncStatsFromWebhook,
} = require("../controllers/StastController");

router.get("/", getStats);
router.post("/", createOrUpdateStats);
router.post("/sync", syncStatsFromWebhook);

module.exports = router;
