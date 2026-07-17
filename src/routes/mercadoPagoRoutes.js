const express = require("express");
const router = express.Router();
const {
  createPaymentPreference,
  handleMercadoPagoWebhook,
} = require("../controllers/mercadoPagoController");

router.post("/create-preference", createPaymentPreference);
router.post("/webhook", handleMercadoPagoWebhook);

module.exports = router;
