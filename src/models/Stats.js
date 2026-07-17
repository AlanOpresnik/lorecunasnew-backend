const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema(
  {
    totalProducts: {
      type: Number,
      required: true,
      default: 0,
    },
    totalOrders: {
      type: Number,
      required: true,
      default: 0,
    },
    inventoryValue: {
      type: Number,
      required: true,
      default: 0,
    },
    productsOutOfStock: {
      type: Number,
      required: true,
      default: 0,
    },
    activeProducts: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Stats", statsSchema);
