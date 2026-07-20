const express = require("express");
const router = express.Router();
const { getCategories, createCategory, deleteCategory } = require("../controllers/categoryController");
const requireAdmin = require('../../authMiddleware');

router.get("/", getCategories);
router.post("/",requireAdmin, createCategory);
router.delete('/:id',requireAdmin,deleteCategory);

module.exports = router;
