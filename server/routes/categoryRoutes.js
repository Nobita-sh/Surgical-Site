const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const { verifyToken, requirePermission } = require('../middleware/auth');

// Public category listing
router.get('/', categoriesController.getCategories);

// Protected category routes (Requires 'products' or 'admin')
router.post('/', verifyToken, requirePermission('products'), categoriesController.createCategory);
router.delete('/:id', verifyToken, requirePermission('products'), categoriesController.deleteCategory);

module.exports = router;
