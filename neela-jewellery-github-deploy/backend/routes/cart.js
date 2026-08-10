const express = require('express');
const router = express.Router();
const { isDbConnected, query, memoryDb } = require('../db');
const { authenticateToken } = require('../middleware/auth');

// All cart routes require user authentication
router.use(authenticateToken);

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const { rows } = await query(
        `SELECT c.id as cart_item_id, c.quantity as qty, p.*
         FROM cart_items c
         JOIN products p ON c.product_id = p.id
         WHERE c.user_id = $1
         ORDER BY c.id ASC`,
        [req.user.id]
      );
      res.json(rows);
    } else {
      const userCart = memoryDb.cart_items
        .filter(ci => ci.user_id === req.user.id)
        .map(ci => {
          const product = memoryDb.products.find(p => p.id === ci.product_id);
          return { cart_item_id: ci.id, qty: ci.quantity, ...product };
        })
        .filter(item => item.id);
      res.json(userCart);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart.' });
  }
});

// POST /api/cart
router.post('/', async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    if (isDbConnected()) {
      // Validate product stock
      const { rows: prods } = await query('SELECT stock FROM products WHERE id = $1', [productId]);
      if (prods.length === 0) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      if (prods[0].stock < qty) {
        return res.status(400).json({ error: 'Requested quantity exceeds available stock.' });
      }

      await query(
        `INSERT INTO cart_items (user_id, product_id, quantity)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, product_id)
         DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = CURRENT_TIMESTAMP`,
        [req.user.id, productId, qty]
      );

      res.status(200).json({ message: 'Cart updated successfully.' });
    } else {
      const product = memoryDb.products.find(p => p.id === parseInt(productId, 10));
      if (!product) return res.status(404).json({ error: 'Product not found.' });

      const existing = memoryDb.cart_items.find(ci => ci.user_id === req.user.id && ci.product_id === parseInt(productId, 10));
      if (existing) {
        existing.quantity += qty;
      } else {
        memoryDb.cart_items.push({
          id: memoryDb.cart_items.length + 1,
          user_id: req.user.id,
          product_id: parseInt(productId, 10),
          quantity: qty
        });
      }
      res.json({ message: 'Cart updated successfully.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item to cart.' });
  }
});

// PUT /api/cart/:productId
router.put('/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const { qty } = req.body;

    if (qty <= 0) {
      if (isDbConnected()) {
        await query('DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2', [req.user.id, productId]);
      } else {
        memoryDb.cart_items = memoryDb.cart_items.filter(ci => !(ci.user_id === req.user.id && ci.product_id === productId));
      }
      return res.json({ message: 'Item removed from cart.' });
    }

    if (isDbConnected()) {
      await query(
        'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3',
        [qty, req.user.id, productId]
      );
    } else {
      const item = memoryDb.cart_items.find(ci => ci.user_id === req.user.id && ci.product_id === productId);
      if (item) item.quantity = qty;
    }

    res.json({ message: 'Quantity updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quantity.' });
  }
});

// DELETE /api/cart/:productId
router.delete('/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (isDbConnected()) {
      await query('DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2', [req.user.id, productId]);
    } else {
      memoryDb.cart_items = memoryDb.cart_items.filter(ci => !(ci.user_id === req.user.id && ci.product_id === productId));
    }
    res.json({ message: 'Item removed from cart.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item.' });
  }
});

// DELETE /api/cart
router.delete('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      await query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);
    } else {
      memoryDb.cart_items = memoryDb.cart_items.filter(ci => ci.user_id !== req.user.id);
    }
    res.json({ message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart.' });
  }
});

module.exports = router;
