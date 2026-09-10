const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const { verifyToken, requirePermission } = require('../middleware/auth');

// Public order placement
router.post('/', ordersController.createOrder);

// Order listing & tracking (Authenticated with courier isolation)
router.get('/', verifyToken, ordersController.getOrders);
router.get('/:id', ordersController.getOrderById);

// Order Fulfillment routes (Requires 'orders' or 'admin')
router.patch('/:id/status', verifyToken, requirePermission('orders'), ordersController.updateOrderStatus);
router.patch('/:id/courier', verifyToken, requirePermission('orders'), ordersController.assignCourier);
router.patch('/:id', verifyToken, requirePermission('orders'), ordersController.updateOrder);
router.put('/:id', verifyToken, requirePermission('orders'), ordersController.updateOrder);

// Customer Support Desk notes (Requires 'support' or 'admin')
router.post('/:id/notes', verifyToken, requirePermission('support'), ordersController.addSupportNote);

// Delivery Courier status updates (Requires 'delivery' or 'admin')
router.patch('/:id/delivery-status', verifyToken, requirePermission('delivery'), ordersController.updateDeliveryStatus);

module.exports = router;
