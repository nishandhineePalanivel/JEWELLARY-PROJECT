const express = require('express');
const router = express.Router();
const { isDbConnected, query, memoryDb } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Protect all admin routes
router.use(authenticateToken, requireAdmin);

// GET /api/admin/dashboard - Executive Summary & Metrics
router.get('/dashboard', async (req, res) => {
  try {
    if (isDbConnected()) {
      const { rows: rev } = await query(`SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM orders WHERE payment_status = 'PAID'`);
      const { rows: ord } = await query(`SELECT COUNT(*) as total_orders FROM orders`);
      const { rows: cust } = await query(`SELECT COUNT(*) as total_customers FROM users WHERE role = 'customer'`);
      const { rows: prod } = await query(`SELECT COUNT(*) as total_products FROM products`);
      const { rows: pend } = await query(`SELECT COUNT(*) as pending_payments FROM orders WHERE payment_status = 'PAYMENT_PENDING_VERIFICATION'`);
      const { rows: lowStock } = await query(`SELECT * FROM products WHERE stock <= 5 ORDER BY stock ASC`);
      const { rows: recentOrders } = await query(`SELECT o.*, u.name as customer_name FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.id DESC LIMIT 5`);

      res.json({
        totalRevenue: parseFloat(rev[0].total_revenue),
        totalOrders: parseInt(ord[0].total_orders, 10),
        totalCustomers: parseInt(cust[0].total_customers, 10),
        totalProducts: parseInt(prod[0].total_products, 10),
        pendingPaymentsCount: parseInt(pend[0].pending_payments, 10),
        lowStockProducts: lowStock,
        recentOrders
      });
    } else {
      const paidOrders = memoryDb.orders.filter(o => o.payment_status === 'PAID');
      const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
      const pendingPaymentsCount = memoryDb.orders.filter(o => o.payment_status === 'PAYMENT_PENDING_VERIFICATION').length;
      const lowStockProducts = memoryDb.products.filter(p => p.stock <= 5);
      const recentOrders = [...memoryDb.orders].reverse().slice(0, 5);

      res.json({
        totalRevenue,
        totalOrders: memoryDb.orders.length,
        totalCustomers: memoryDb.users.filter(u => u.role === 'customer').length,
        totalProducts: memoryDb.products.length,
        pendingPaymentsCount,
        lowStockProducts,
        recentOrders
      });
    }
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ error: 'Failed to load admin metrics.' });
  }
});

// GET /api/admin/products
router.get('/products', async (req, res) => {
  try {
    if (isDbConnected()) {
      const { rows } = await query(
        `SELECT p.*, COALESCE(
          json_agg(
            json_build_object('id', pi.id, 'image_url', pi.image_url, 'is_primary', pi.is_primary)
          ) FILTER (WHERE pi.id IS NOT NULL), '[]'
        ) AS images
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        GROUP BY p.id
        ORDER BY p.id DESC`
      );
      res.json(rows);
    } else {
      res.json(memoryDb.products);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin products.' });
  }
});

// POST /api/admin/products - Add Product
router.post('/products', async (req, res) => {
  try {
    const { name, sku, category, material, price, discount_percent, weight_grams, stock, description, image_url, is_featured } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Product name, category, and price are required.' });
    }

    const generateSku = sku || `NJ-${category.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    if (isDbConnected()) {
      const { rows } = await query(
        `INSERT INTO products (sku, name, description, price, discount_percent, category, material, weight_grams, stock, is_featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [generateSku, name, description || '', price, discount_percent || 0, category, material || '', weight_grams || 0, stock || 1, !!is_featured]
      );
      const newProd = rows[0];
      if (image_url) {
        await query(`INSERT INTO product_images (product_id, image_url, is_primary) VALUES ($1, $2, true)`, [newProd.id, image_url]);
      }
      res.status(201).json(newProd);
    } else {
      const newProd = {
        id: memoryDb.products.length + 1,
        sku: generateSku,
        name,
        description: description || '',
        price: parseFloat(price),
        discount_percent: parseFloat(discount_percent || 0),
        category,
        material: material || '',
        weight_grams: parseFloat(weight_grams || 0),
        stock: parseInt(stock || 1, 10),
        rating: 5.0,
        is_featured: !!is_featured,
        images: image_url ? [image_url] : ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80']
      };
      memoryDb.products.unshift(newProd);
      res.status(201).json(newProd);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

// PUT /api/admin/products/:id - Edit Product / Update Stock & Price
router.put('/products/:id', async (req, res) => {
  try {
    const prodId = parseInt(req.params.id, 10);
    const { name, category, material, price, discount_percent, weight_grams, stock, description, is_featured } = req.body;

    if (isDbConnected()) {
      const { rows } = await query(
        `UPDATE products SET
          name = COALESCE($1, name),
          category = COALESCE($2, category),
          material = COALESCE($3, material),
          price = COALESCE($4, price),
          discount_percent = COALESCE($5, discount_percent),
          weight_grams = COALESCE($6, weight_grams),
          stock = COALESCE($7, stock),
          description = COALESCE($8, description),
          is_featured = COALESCE($9, is_featured)
         WHERE id = $10 RETURNING *`,
        [name, category, material, price, discount_percent, weight_grams, stock, description, is_featured, prodId]
      );
      res.json(rows[0]);
    } else {
      const p = memoryDb.products.find(item => item.id === prodId);
      if (!p) return res.status(404).json({ error: 'Product not found.' });

      if (name !== undefined) p.name = name;
      if (category !== undefined) p.category = category;
      if (material !== undefined) p.material = material;
      if (price !== undefined) p.price = parseFloat(price);
      if (discount_percent !== undefined) p.discount_percent = parseFloat(discount_percent);
      if (weight_grams !== undefined) p.weight_grams = parseFloat(weight_grams);
      if (stock !== undefined) p.stock = parseInt(stock, 10);
      if (description !== undefined) p.description = description;
      if (is_featured !== undefined) p.is_featured = is_featured;

      res.json(p);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    const prodId = parseInt(req.params.id, 10);
    if (isDbConnected()) {
      await query('DELETE FROM products WHERE id = $1', [prodId]);
    } else {
      memoryDb.products = memoryDb.products.filter(p => p.id !== prodId);
    }
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

// GET /api/admin/orders - View all orders
router.get('/orders', async (req, res) => {
  try {
    if (isDbConnected()) {
      const { rows } = await query(
        `SELECT o.*, u.name as customer_name, u.email as customer_email, COALESCE(
          json_agg(
            json_build_object('id', oi.id, 'product_id', oi.product_id, 'product_name', oi.product_name, 'price', oi.price, 'quantity', oi.quantity, 'total', oi.total)
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) AS items
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id, u.name, u.email
        ORDER BY o.id DESC`
      );
      res.json(rows);
    } else {
      const orders = memoryDb.orders.map(o => {
        const u = memoryDb.users.find(usr => usr.id === o.user_id);
        return {
          ...o,
          customer_name: u ? u.name : 'Customer',
          customer_email: u ? u.email : 'N/A'
        };
      });
      res.json(orders.sort((a, b) => b.id - a.id));
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// PUT /api/admin/orders/:id/status - Update Order Status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    const { order_status, payment_status } = req.body;

    if (isDbConnected()) {
      let sql = 'UPDATE orders SET ';
      const params = [];

      if (order_status) {
        params.push(order_status);
        sql += `order_status = $${params.length}`;
      }
      if (payment_status) {
        if (params.length > 0) sql += ', ';
        params.push(payment_status);
        sql += `payment_status = $${params.length}`;
      }
      params.push(orderId);
      sql += ` WHERE id = $${params.length} RETURNING *`;

      const { rows } = await query(sql, params);
      res.json(rows[0]);
    } else {
      const order = memoryDb.orders.find(o => o.id === orderId);
      if (!order) return res.status(404).json({ error: 'Order not found.' });
      if (order_status) order.order_status = order_status;
      if (payment_status) order.payment_status = payment_status;
      res.json(order);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

// GET /api/admin/payments - List Payments
router.get('/payments', async (req, res) => {
  try {
    if (isDbConnected()) {
      const { rows } = await query(
        `SELECT p.*, o.order_number, o.total_amount, u.name as customer_name
         FROM payments p
         JOIN orders o ON p.order_id = o.id
         LEFT JOIN users u ON o.user_id = u.id
         ORDER BY p.id DESC`
      );
      res.json(rows);
    } else {
      const payments = memoryDb.payments.map(pm => {
        const o = memoryDb.orders.find(ord => ord.id === pm.order_id);
        const u = o ? memoryDb.users.find(usr => usr.id === o.user_id) : null;
        return {
          ...pm,
          order_number: o ? o.order_number : `NJ-${pm.order_id}`,
          customer_name: u ? u.name : 'Customer'
        };
      });
      res.json(payments.sort((a, b) => b.id - a.id));
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payment records.' });
  }
});

// POST /api/admin/payments/:id/verify - Verify UPI/Bank Transfer Payment (Approve/Reject)
router.post('/payments/:id/verify', async (req, res) => {
  try {
    const paymentId = parseInt(req.params.id, 10);
    const { status, adminNotes } = req.body; // status: 'PAID' or 'FAILED'

    if (!['PAID', 'FAILED'].includes(status)) {
      return res.status(400).json({ error: 'Status must be PAID or FAILED.' });
    }

    if (isDbConnected()) {
      const { rows: pmRows } = await query('SELECT order_id FROM payments WHERE id = $1', [paymentId]);
      if (pmRows.length === 0) return res.status(404).json({ error: 'Payment record not found.' });

      const orderId = pmRows[0].order_id;
      const newOrderStatus = status === 'PAID' ? 'CONFIRMED' : 'CANCELLED';

      await query(
        `UPDATE payments SET status = $1, admin_verified_at = CURRENT_TIMESTAMP, admin_notes = $2 WHERE id = $3`,
        [status, adminNotes || '', paymentId]
      );

      await query(
        `UPDATE orders SET payment_status = $1, order_status = $2 WHERE id = $3`,
        [status, newOrderStatus, orderId]
      );

      res.json({ message: `Payment verified and status updated to ${status}.` });
    } else {
      const pm = memoryDb.payments.find(p => p.id === paymentId);
      if (!pm) return res.status(404).json({ error: 'Payment record not found.' });

      pm.status = status;
      pm.admin_verified_at = new Date();
      pm.admin_notes = adminNotes || '';

      const order = memoryDb.orders.find(o => o.id === pm.order_id);
      if (order) {
        order.payment_status = status;
        order.order_status = status === 'PAID' ? 'CONFIRMED' : 'CANCELLED';
      }

      res.json({ message: `Payment verified and status updated to ${status}.` });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify payment.' });
  }
});

module.exports = router;
