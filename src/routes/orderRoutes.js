const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderByPreferenceId,
  getOrderStats,
} = require("../controllers/orderController");

router.get("/", getOrders);
router.get('/stats', getOrderStats)
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);
router.get('/preferenceId/:preferenceId', getOrderByPreferenceId)

module.exports = router;
