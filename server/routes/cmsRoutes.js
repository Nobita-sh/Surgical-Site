const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cmsController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Homepage layout routes (public read, admin write)
router.get('/homepage-sections', cmsController.getHomepageSections);
router.put('/homepage-sections', verifyToken, requireAdmin, cmsController.updateHomepageSections);

// Promos and vouchers routes (public read, admin write)
router.get('/promos', cmsController.getPromos);
router.put('/promos', verifyToken, requireAdmin, cmsController.updatePromos);

// Policy pages routes (public read, admin write)
router.get('/policy-pages', cmsController.getPolicyData);
router.put('/policy-pages', verifyToken, requireAdmin, cmsController.updatePolicyData);

// Header, Footer, Brand Identity & Global SEO (public read, admin write)
router.get('/header-footer', cmsController.getHeaderFooter);
router.put('/header-footer', verifyToken, requireAdmin, cmsController.updateHeaderFooter);

module.exports = router;
