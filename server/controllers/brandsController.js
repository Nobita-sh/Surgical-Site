const Store = require('../data/store');

exports.getBrands = async (req, res) => {
  try {
    const brands = await Store.getBrands();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBrand = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Brand name is required' });
    }
    const brand = await Store.createBrand(req.body);
    await Store.addAuditLog({ action: `Brand Partner Added: ${brand.name}`, actor: 'Admin', origin: req.ip || 'API' });
    res.status(201).json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Store.updateBrand(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    await Store.addAuditLog({ action: `Brand Updated: ${updated.name}`, actor: 'Admin', origin: req.ip || 'API' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Store.deleteBrand(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    await Store.addAuditLog({ action: `Brand Removed: ${id}`, actor: 'Admin', origin: req.ip || 'API' });
    res.json({ success: true, message: 'Brand partner removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
