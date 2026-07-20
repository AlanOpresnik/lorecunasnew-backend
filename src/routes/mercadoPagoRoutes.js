const express = require("express");
const router = express.Router();
const {
  createPaymentPreference,
  handleMercadoPagoWebhook,
} = require("../controllers/mercadoPagoController");
const requireAdmin = require('../../authMiddleware');

router.post("/create-preference", createPaymentPreference);
router.post("/webhook", handleMercadoPagoWebhook);

module.exports = router;
