const Order = require("../models/Order");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderStats = async (req, res) => {
  try {
    const orders = await Order.find();

    const stats = {
      totalOrders: orders.length,
      approved: 0,
      pending: 0,
      rejected: 0,
      totalRevenue: 0,
    };

    for (const order of orders) {
      switch (order.statusPago) {
        case "approved":
          stats.approved++;
          stats.totalRevenue += order.montoPago || 0;
          break;

        case "pending":
          stats.pending++;
          break;

        case "rejected":
          stats.rejected++;
          break;
      }
    }

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderByPreferenceId = async (req, res) => {
  try {
    const { preferenceId } = req.params;

    console.log(preferenceId);

    const order = await Order.findOne({
      mercadoPagoId: preferenceId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { statusPago, mercadoPagoId, direction } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        statusPago,
        ...(mercadoPagoId !== undefined && { mercadoPagoId }),
        ...(direction !== undefined && { direction }),
      },
      { new: true, runValidators: true },
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderByPreferenceId,
  getOrderStats
};
