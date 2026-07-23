const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductByCategory,
} = require("../controllers/productController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

const requireAdmin = require('../../authMiddleware');

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category",getProductByCategory);
router.post("/", upload.array("imageFiles", 10),requireAdmin, createProduct);
router.get("/:id", getProductById);
router.put("/:id", upload.array("imageFiles", 10),requireAdmin, updateProduct);
router.delete("/:id",requireAdmin, deleteProduct);

module.exports = router;
