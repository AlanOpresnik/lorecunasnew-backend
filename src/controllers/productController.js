const Product = require("../models/Product");
const { uploadBufferToCloudinary } = require("../config/cloudinary");

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "on"].includes(normalized)) return true;
    if (["false", "0", "no", "off", ""].includes(normalized)) return false;
  }
  return Boolean(value);
};

const parseJsonArray = (value, fallback = []) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      return trimmed
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return fallback;
};

const parseCharacteristics = (value) => {
  const parsed = parseJsonArray(value, []);
  return parsed.map((item) => {
    if (typeof item === "string") {
      return { title: item, value: "" };
    }
    return {
      title: item?.title ?? "",
      value: item?.value ?? "",
    };
  });
};

const buildProductData = async (body = {}, files = []) => {
  const data = { ...body };
  const existingImages = parseJsonArray(body.existingImages, []);

  if (body.status === "draft") {
    data.status = "inactive";
  } else if (body.status === "inactive") {
    data.status = "inactive";
  } else {
    data.status = "active";
  }

  if (typeof body.featured !== "undefined") {
    data.featured = normalizeBoolean(body.featured);
  }

  if (typeof body.isNew !== "undefined") {
    data.isNewProduct = normalizeBoolean(body.isNew);
  } else if (typeof body.isNewProduct !== "undefined") {
    data.isNewProduct = normalizeBoolean(body.isNewProduct);
  }

  if (typeof body.colors !== "undefined") {
    data.colors = parseJsonArray(body.colors, []);
  }

  if (typeof body.caracteristics !== "undefined") {
    data.caracteristics = parseCharacteristics(body.caracteristics);
  }

  if (typeof body.categorySlug === "undefined" || !body.categorySlug) {
    data.categorySlug = body.category
      ?.trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  if (body.price !== undefined && body.price !== "") {
    data.price = Number(body.price);
  }

  if (body.originalPrice !== undefined && body.originalPrice !== "") {
    data.originalPrice = Number(body.originalPrice);
  } else {
    delete data.originalPrice;
  }

  if (body.stock !== undefined && body.stock !== "") {
    data.stock = Number(body.stock);
  }

  const uploadedImages = [];
  for (const file of files) {
    if (file && file.buffer) {
      const url = await uploadBufferToCloudinary(file);
      uploadedImages.push(url);
    }
  }

  if (existingImages.length || uploadedImages.length) {
    data.images = [...existingImages, ...uploadedImages];
  }

  delete data.existingImages;
  delete data.imageFiles;
  delete data.id;

  return data;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProductByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res) => {
  try {
    const payload = await buildProductData(req.body, req.files || []);
    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
  try {
    const payload = await buildProductData(req.body, req.files || []);
    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductByCategory,
};
