const mongoose = require("mongoose");

const caracteristicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Please add a slug"],
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    originalPrice: {
      type: Number,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    shortDescription: {
      type: String,
      required: [true, "Please add a short description"],
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
    },
    categorySlug: {
      type: String,
      required: [true, "Please add a category slug"],
    },
    caracteristics: [caracteristicSchema],
    colors: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isNewProduct: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      required: [true, "Please add stock quantity"],
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
