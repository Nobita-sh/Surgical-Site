const Store = require('../data/store');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Store.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required.' });
    }
    const category = await Store.createCategory(req.body);
    await Store.addAuditLog({ action: `Category Created: ${category.name}`, actor: 'Admin', origin: req.ip || 'API', details: category.id });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Store.deleteCategory(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }
    await Store.addAuditLog({ action: `Category Deleted: ${id}`, actor: 'Admin', origin: req.ip || 'API' });
    res.json({ success: true, message: 'Category removed from catalog' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
