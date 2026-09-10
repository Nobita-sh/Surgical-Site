const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { verifyToken, requirePermission } = require('../middleware/auth');

// Public catalog routes
router.get('/', productsController.getProducts);
router.get('/:identifier', productsController.getProductBySlugOrId);

// Product image upload route
router.post('/upload', productsController.uploadProductImage);

// Protected inventory/product management routes (Requires 'products' or 'admin')
router.post('/', verifyToken, requirePermission('products'), productsController.createProduct);
router.put('/:id', verifyToken, requirePermission('products'), productsController.updateProduct);
router.delete('/:id', verifyToken, requirePermission('products'), productsController.deleteProduct);

module.exports = router;
