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
    fileSize: 5 * 1024 * 1024,
  },
});

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductByCategory);
router.post("/", upload.array("imageFiles", 10), createProduct);
router.get("/:id", getProductById);
router.put("/:id", upload.array("imageFiles", 10), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
