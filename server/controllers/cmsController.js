const Store = require('../data/store');

// Homepage Sections
exports.getHomepageSections = async (req, res) => {
  try {
    const sections = await Store.getHomepageSections();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateHomepageSections = async (req, res) => {
  try {
    const sections = await Store.updateHomepageSections(req.body);
    await Store.addAuditLog({ action: 'Homepage Section Layout Updated', actor: 'Admin', origin: req.ip || 'API' });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Promos & Vouchers
exports.getPromos = async (req, res) => {
  try {
    const promos = await Store.getPromos();
    res.json(promos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePromos = async (req, res) => {
  try {
    const promos = await Store.updatePromos(req.body);
    await Store.addAuditLog({ action: 'Promotional Banners & Vouchers Updated', actor: 'Admin', origin: req.ip || 'API' });
    res.json(promos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Policy Pages Data
exports.getPolicyData = async (req, res) => {
  try {
    const policy = await Store.getPolicyData();
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePolicyData = async (req, res) => {
  try {
    const policy = await Store.updatePolicyData(req.body);
    await Store.addAuditLog({ action: 'Legal & Policy Terms Updated', actor: 'Admin', origin: req.ip || 'API' });
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Header, Footer, Brand Identity & Global SEO
exports.getHeaderFooter = async (req, res) => {
  try {
    const data = await Store.getHeaderFooterData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateHeaderFooter = async (req, res) => {
  try {
    const data = await Store.updateHeaderFooterData(req.body);
    await Store.addAuditLog({ action: 'Header, Footer & Brand Identity Updated', actor: 'Admin', origin: req.ip || 'API' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

