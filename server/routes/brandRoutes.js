const express = require('express');
const router = express.Router();
const brandsController = require('../controllers/brandsController');
const { verifyToken, requirePermission } = require('../middleware/auth');

// Public brand list
router.get('/', brandsController.getBrands);

// Protected brand routes (Requires 'products' or 'admin')
router.post('/', verifyToken, requirePermission('products'), brandsController.createBrand);
router.patch('/:id', verifyToken, requirePermission('products'), brandsController.updateBrand);
router.delete('/:id', verifyToken, requirePermission('products'), brandsController.deleteBrand);

module.exports = router;
