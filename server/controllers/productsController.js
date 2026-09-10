const fs = require('fs');
const path = require('path');
const Store = require('../data/store');

exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const products = await Store.getProducts({ categoryId: category, search });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductBySlugOrId = async (req, res) => {
  try {
    const { identifier } = req.params;
    const product = await Store.getProductByIdOrSlug(identifier);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Product name and price are required.' });
    }

    const product = await Store.createProduct(req.body);
    await Store.addAuditLog({ action: `Product Created: ${product.name}`, actor: 'Admin', origin: req.ip || 'API', details: product.id });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Store.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Store.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await Store.addAuditLog({ action: `Product Deleted: ${id}`, actor: 'Admin', origin: req.ip || 'API' });
    res.json({ success: true, message: 'Product removed from catalog' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadProductImage = async (req, res) => {
  try {
    const { image, filename } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image data provided.' });
    }

    let buffer;
    let ext = '.png';

    const matches = String(image).match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mimeType = matches[1].toLowerCase();
      buffer = Buffer.from(matches[2], 'base64');
      if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
      else if (mimeType.includes('png')) ext = '.png';
      else if (mimeType.includes('webp')) ext = '.webp';
      else if (mimeType.includes('svg')) ext = '.svg';
      else if (mimeType.includes('gif')) ext = '.gif';
    } else {
      buffer = Buffer.from(image, 'base64');
    }

    const safeBase = (filename || 'product')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase()
      .slice(0, 40) || 'product';

    const uniqueName = `${safeBase}-${Date.now()}${ext}`;
    const uploadDir = path.join(__dirname, '../../public/assets/products');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueName);
    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/assets/products/${uniqueName}`;
    res.json({
      success: true,
      url: relativeUrl,
      filename: uniqueName
    });
  } catch (err) {
    console.error('[Upload Product Image Error]', err);
    res.status(500).json({ error: err.message || 'Failed to upload image' });
  }
};
