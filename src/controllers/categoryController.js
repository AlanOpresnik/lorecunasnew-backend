const Category = require("../models/Category");

const buildCategorySlug = (name = "") =>
  name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, image, active } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const slug = (req.body.name || buildCategorySlug(name)).trim().toLowerCase();

    const category = await Category.create({
      name: name.trim(),
      slug,
      description: description || "",
      active: typeof active === "boolean" ? active : true,
    });

    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Category already exists" });
    }
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req,res)=> {
    const {id} = req.params;

    try {
        const res = await Category.findByIdAndDelete(id)
        return res.status(200).json(res)
    } catch (error) {
       res.status(400).json({
        error,
        message: 'fallo la peticion de category'
       })
    }
}

module.exports = {
  getCategories,
  createCategory,
  deleteCategory
};
