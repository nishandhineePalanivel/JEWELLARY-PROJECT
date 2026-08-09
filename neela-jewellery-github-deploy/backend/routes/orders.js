const express = require('express');
const router = express.Router();
const { isDbConnected, query, memoryDb } = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { generateInvoicePdf } = require('../utils/invoiceGenerator');

// GET /api/orders - User Order History
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (isDbConnected()) {
      const { rows } = await query(
        `SELECT o.*, COALESCE(
          json_agg(
            json_build_object('id', oi.id, 'product_id', oi.product_id, 'product_name', oi.product_name, 'price', oi.price, 'quantity', oi.quantity, 'total', oi.total)
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) AS items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.id DESC`,
        [req.user.id]
      );
      res.json(rows);
    } else {
      const userOrders = memoryDb.orders
        .filter(o => o.user_id === req.user.id)
        .map(o => ({
          ...o,
          items: o.items || []
        }));
      res.json(userOrders.sort((a, b) => b.id - a.id));
    }
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ error: 'Failed to fetch order history.' });
  }
});

// GET /api/orders/:id - Single Order Detail
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const orderIdParam = req.params.id;

    if (isDbConnected()) {
      const { rows } = await query(
        `SELECT o.*, COALESCE(
          json_agg(
            json_build_object('id', oi.id, 'product_id', oi.product_id, 'product_name', oi.product_name, 'price', oi.price, 'quantity', oi.quantity, 'total', oi.total)
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) AS items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE (o.order_number = $1 OR CAST(o.id AS TEXT) = $1) AND (o.user_id = $2 OR $3 = 'admin')
        GROUP BY o.id`,
        [orderIdParam, req.user.id, req.user.role]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Order not found or unauthorized.' });
      }

      res.json(rows[0]);
    } else {
      const order = memoryDb.orders.find(o => 
        (o.order_number === orderIdParam || String(o.id) === String(orderIdParam)) &&
        (o.user_id === req.user.id || req.user.role === 'admin')
      );

      if (!order) {
        return res.status(404).json({ error: 'Order not found or unauthorized.' });
      }

      res.json(order);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order detail.' });
  }
});

// GET /api/orders/:id/invoice - Download PDF Invoice
router.get('/:id/invoice', authenticateToken, async (req, res) => {
  try {
    const orderIdParam = req.params.id;
    let order = null;

    if (isDbConnected()) {
      const { rows } = await query(
        `SELECT o.*, COALESCE(
          json_agg(
            json_build_object('id', oi.id, 'product_id', oi.product_id, 'product_name', oi.product_name, 'price', oi.price, 'quantity', oi.quantity, 'total', oi.total)
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) AS items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE (o.order_number = $1 OR CAST(o.id AS TEXT) = $1) AND (o.user_id = $2 OR $3 = 'admin')
        GROUP BY o.id`,
        [orderIdParam, req.user.id, req.user.role]
      );
      if (rows.length > 0) order = rows[0];
    } else {
      order = memoryDb.orders.find(o => 
        (o.order_number === orderIdParam || String(o.id) === String(orderIdParam)) &&
        (o.user_id === req.user.id || req.user.role === 'admin')
      );
    }

    if (!order) {
      return res.status(404).json({ error: 'Order invoice not found.' });
    }

    generateInvoicePdf(order, res);
  } catch (err) {
    console.error('Invoice generation error:', err);
    res.status(500).json({ error: 'Failed to generate invoice PDF.' });
  }
});

module.exports = router;
