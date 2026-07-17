const Stats = require("../models/Stats");
const Product = require("../models/Product");

const calculateStats = async () => {
  const [products, existingStats] = await Promise.all([
    Product.find({}, "price stock status featured"),
    Stats.findOne().sort({ createdAt: -1 }),
  ]);

  const totalProducts = products.length;
  const activeProducts = products.filter((product) => product.status === "active").length;
  const productsOutOfStock = products.filter((product) => Number(product.stock) <= 0).length;
  const inventoryValue = products.reduce((sum, product) => sum + Number(product.price) * Number(product.stock || 0), 0);

  const statsData = {
    totalProducts,
    totalOrders: existingStats?.totalOrders ?? 0,
    inventoryValue,
    productsOutOfStock,
    activeProducts,
  };

  return statsData;
};

const getStats = async (req, res) => {
  try {
    const stats = await Stats.findOne().sort({ createdAt: -1 });

    if (!stats) {
      const initialStats = await calculateStats();
      const createdStats = await Stats.create(initialStats);
      return res.status(200).json(createdStats);
    }

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrUpdateStats = async (req, res) => {
  try {
    const nextStats = await calculateStats();

    const payload = {
      ...nextStats,
      ...(req.body?.totalOrders !== undefined ? { totalOrders: Number(req.body.totalOrders) } : {}),
    };

    const stats = await Stats.findOneAndUpdate(
      {},
      { $set: payload },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const syncStatsFromWebhook = async (req, res) => {
  try {
    const { orderStatus, orderAmount, orderCount } = req.body || {};

    const currentStats = await Stats.findOne().sort({ createdAt: -1 });
    const baseData = await calculateStats();

    const payload = {
      ...baseData,
      totalOrders: currentStats?.totalOrders ?? 0,
    };

    if (orderCount !== undefined) {
      payload.totalOrders += Number(orderCount);
    }

    if (orderAmount !== undefined && orderStatus && ["approved", "paid", "completed"].includes(String(orderStatus).toLowerCase())) {
      payload.totalOrders = Math.max(payload.totalOrders, 1);
    }

    const stats = await Stats.findOneAndUpdate(
      {},
      { $set: payload },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: "Stats synced", stats });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  createOrUpdateStats,
  syncStatsFromWebhook,
};
        