const Store = require('../data/store');

exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, deliveryAddress, items } = req.body;
    if (!customerName || !customerPhone || !deliveryAddress || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Customer name, phone, delivery address, and at least one item are required.' });
    }

    // 1. Server-Side Price & Inventory Recalculation (Never trust client prices or totals)
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      if (!item || !item.id) {
        return res.status(400).json({ error: 'Each order item must specify a valid product id.' });
      }

      const product = await Store.getProductByIdOrSlug(item.id);
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${item.id}` });
      }

      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty < 1) {
        return res.status(400).json({ error: `Invalid quantity for product ${product.name}. Quantity must be at least 1.` });
      }

      // Fast stock pre-check (Friendly error before atomic reservation)
      if (Number(product.stock) < qty) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${qty}`
        });
      }

      const canonicalPrice = Number(product.price);
      subtotal += canonicalPrice * qty;

      verifiedItems.push({
        id: product.id,
        name: product.name,
        price: canonicalPrice,
        quantity: qty
      });
    }

    // 2. Server-Side Shipping Rule: Free for orders >= Rs. 5,000, else flat Rs. 250
    const shippingFee = subtotal >= 5000 ? 0 : 250;

    // 3. Server-Side Coupon Validation
    let validatedDiscount = 0;
    let validatedCouponCode = null;

    if (req.body.couponCode && typeof req.body.couponCode === 'string') {
      const codeUpper = req.body.couponCode.trim().toUpperCase();
      const promos = await Store.getPromos();
      const vouchers = (promos && promos.vouchers) || [];
      const voucher = vouchers.find(v => v.code && v.code.toUpperCase() === codeUpper && v.status === 'Active');

      if (voucher && subtotal >= (Number(voucher.minOrder) || 0)) {
        validatedCouponCode = voucher.code;
        if (voucher.type === 'Percentage' || (voucher.discount && voucher.discount.includes('%'))) {
          const pct = parseFloat(voucher.discount) || 0;
          validatedDiscount = Math.round(subtotal * (pct / 100));
        } else {
          // Fixed numeric discount
          validatedDiscount = Math.round(parseFloat(voucher.discount.replace(/[^0-9.]/g, '')) || 0);
        }
      }
    }

    // Refinement 4: Clamp the discount so it can never exceed (subtotal + shippingFee)
    const maxAllowedDiscount = subtotal + shippingFee;
    validatedDiscount = Math.min(Math.max(0, validatedDiscount), maxAllowedDiscount);

    // Compute final payable total purely server-side
    const finalServerTotal = Math.max(0, subtotal + shippingFee - validatedDiscount);

    // 4. Create Order and execute Atomic Stock Decrement within Transaction
    const orderPayload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: (req.body.customerEmail || '').trim(),
      deliveryAddress: deliveryAddress.trim(),
      city: req.body.city || 'Lahore',
      paymentMethod: req.body.paymentMethod || 'cod',
      subtotal,
      shippingFee,
      discount: validatedDiscount,
      couponCode: validatedCouponCode,
      total: finalServerTotal,
      items: verifiedItems,
      notes: req.body.notes || ''
    };

    const order = await Store.createOrder(orderPayload);
    res.status(201).json(order);
  } catch (err) {
    if (err.message && err.message.includes('Insufficient stock')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieve orders with RBAC & Courier isolation filtering
 */
exports.getOrders = async (req, res) => {
  try {
    const { email } = req.query;
    let orders = await Store.getOrders();

    // 1. Customer filtering by own email
    if (email) {
      orders = orders.filter(o => o.customerEmail && o.customerEmail.toLowerCase() === email.toLowerCase());
      return res.json(orders);
    }

    // 2. Courier isolation: If caller only has 'delivery' permission (and not admin or orders staff)
    if (req.user) {
      const perms = Array.isArray(req.user.permissions) ? req.user.permissions : [];
      const isFullAdmin = req.user.role === 'admin';
      const hasOrdersAccess = perms.includes('orders') || perms.includes('support');

      if (!isFullAdmin && !hasOrdersAccess && perms.includes('delivery')) {
        // Enforce strict courier isolation: ONLY show orders assigned to this courier
        orders = orders.filter(o => o.assignedCourierId === req.user.id);
        
        // Strip sensitive business margins or analytics if any
        orders = orders.map(o => ({
          id: o.id,
          customerName: o.customerName,
          customerPhone: o.customerPhone,
          deliveryAddress: o.deliveryAddress,
          city: o.city,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          orderStatus: o.orderStatus,
          total: o.total,
          items: o.items,
          courierName: o.courierName,
          trackingNumber: o.trackingNumber,
          deliveryNotes: o.deliveryNotes || '',
          assignedCourierId: o.assignedCourierId,
          assignedCourierName: o.assignedCourierName,
          createdAt: o.createdAt
        }));
        return res.json(orders);
      }
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Store.getOrderById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found. Please verify Order ID or Contact Phone.' });
    }

    // If caller is courier, ensure order is assigned to them
    if (req.user && req.user.role !== 'admin') {
      const perms = Array.isArray(req.user.permissions) ? req.user.permissions : [];
      if (perms.includes('delivery') && !perms.includes('orders') && !perms.includes('support')) {
        if (order.assignedCourierId !== req.user.id) {
          return res.status(403).json({ error: 'Access forbidden. This order is not assigned to you.' });
        }
      }
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Store.updateOrder(id, {
      ...req.body,
      orderStatus: status || req.body.orderStatus
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const actionDesc = status ? `Order ${id} Status → ${status}` : `Order ${id} Updated`;
    await Store.addAuditLog({ action: actionDesc, actor: (req.user && req.user.email) || 'Staff', origin: req.ip || 'API', details: id });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Store.updateOrder(id, req.body);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    await Store.addAuditLog({ action: `Order ${id} Updated`, actor: (req.user && req.user.email) || 'Staff', origin: req.ip || 'API', details: JSON.stringify(req.body) });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Assign or reassign courier to order (requires 'orders' or 'admin' permission)
 */
exports.assignCourier = async (req, res) => {
  try {
    const { id } = req.params;
    const { courierId, courierName, trackingNumber } = req.body;

    if (!courierId || !courierName) {
      return res.status(400).json({ error: 'Courier ID and Courier Name are required.' });
    }

    const order = await Store.getOrderById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const updatePayload = {
      assignedCourierId: courierId,
      assignedCourierName: courierName,
      courierName: courierName,
      trackingNumber: trackingNumber || order.trackingNumber || ('DW-' + Math.floor(1000000 + Math.random() * 9000000))
    };

    // If order was pending/processing, advance status to Dispatched
    if (order.orderStatus === 'Pending' || order.orderStatus === 'Processing Order') {
      updatePayload.orderStatus = 'Dispatched via Daewoo Fastex';
    }

    const updated = await Store.updateOrder(id, updatePayload);

    await Store.addAuditLog({
      action: `Order ${id} Assigned to Courier: ${courierName} (${courierId})`,
      actor: (req.user && req.user.email) || 'Staff',
      origin: req.ip || 'API',
      details: JSON.stringify({ trackingNumber: updatePayload.trackingNumber })
    });

    res.json({
      success: true,
      message: `Order assigned to ${courierName} successfully.`,
      order: updated
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Append internal support note to order (requires 'support' or 'admin' permission)
 */
exports.addSupportNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({ error: 'Support note content cannot be empty.' });
    }

    const order = await Store.getOrderById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const newNote = {
      author: (req.user && req.user.email) || 'Support Staff',
      note: note.trim(),
      timestamp: new Date().toISOString()
    };

    const existingNotes = Array.isArray(order.supportNotes) ? order.supportNotes : [];
    const updatedNotes = [newNote, ...existingNotes];

    const updated = await Store.updateOrder(id, { supportNotes: updatedNotes });

    await Store.addAuditLog({
      action: `Support Note Appended to Order ${id}`,
      actor: (req.user && req.user.email) || 'Support Staff',
      origin: req.ip || 'API',
      details: note.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Support note added successfully.',
      notes: updatedNotes,
      order: updated
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Courier updates delivery status (requires 'delivery' or 'admin' permission)
 * Only allowed for orders assigned to that courier
 */
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, deliveryNotes } = req.body;

    const validStatuses = ['Out for Delivery', 'Delivered', 'Failed Delivery Attempt'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Store.getOrderById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // If caller is courier, ensure order is assigned to them
    if (req.user && req.user.role !== 'admin') {
      const perms = Array.isArray(req.user.permissions) ? req.user.permissions : [];
      if (!perms.includes('orders') && perms.includes('delivery')) {
        if (order.assignedCourierId !== req.user.id) {
          return res.status(403).json({ error: 'Access forbidden. You are not assigned to deliver this order.' });
        }
      }
    }

    const updatePayload = {
      orderStatus: status,
      deliveryNotes: deliveryNotes || order.deliveryNotes || ''
    };

    // Do not automatically mark COD as paid — cash collection must be audited/confirmed separately
    const updated = await Store.updateOrder(id, updatePayload);

    await Store.addAuditLog({
      action: `Delivery Status: Order ${id} → ${status}`,
      actor: (req.user && req.user.email) || 'Courier Staff',
      origin: req.ip || 'API',
      details: deliveryNotes ? `Note: ${deliveryNotes}` : undefined
    });

    res.json({
      success: true,
      message: `Order delivery status updated to ${status}.`,
      order: updated
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
