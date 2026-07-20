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
const requireAdmin = require('../../authMiddleware');

router.get("/", requireAdmin, getOrders);
router.get("/stats", requireAdmin, getOrderStats);
router.get("/:id", requireAdmin, getOrderById);
router.post("/", requireAdmin, createOrder);
router.put("/:id/status", requireAdmin, updateOrderStatus);
router.delete("/:id", requireAdmin, deleteOrder);
router.get("/preferenceId/:preferenceId", requireAdmin, getOrderByPreferenceId);

module.exports = router;
