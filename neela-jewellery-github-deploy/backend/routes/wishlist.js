const express = require('express');
const router = express.Router();
const { isDbConnected, query, memoryDb } = require('../db');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/wishlist
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const { rows } = await query(
        `SELECT w.id as wishlist_id, w.created_at as added_at, p.*
         FROM wishlist w
         JOIN products p ON w.product_id = p.id
         WHERE w.user_id = $1
         ORDER BY w.id DESC`,
        [req.user.id]
      );
      res.json(rows);
    } else {
      const userWishlist = memoryDb.wishlist
        .filter(w => w.user_id === req.user.id)
        .map(w => {
          const product = memoryDb.products.find(p => p.id === w.product_id);
          return { wishlist_id: w.id, added_at: w.created_at, ...product };
        })
        .filter(item => item.id);
      res.json(userWishlist);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist.' });
  }
});

// POST /api/wishlist
router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'Product ID required.' });

    if (isDbConnected()) {
      await query(
        'INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) ON CONFLICT (user_id, product_id) DO NOTHING',
        [req.user.id, productId]
      );
    } else {
      const existing = memoryDb.wishlist.find(w => w.user_id === req.user.id && w.product_id === parseInt(productId, 10));
      if (!existing) {
        memoryDb.wishlist.push({ id: memoryDb.wishlist.length + 1, user_id: req.user.id, product_id: parseInt(productId, 10), created_at: new Date() });
      }
    }
    res.json({ message: 'Added to wishlist.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update wishlist.' });
  }
});

// DELETE /api/wishlist/:productId
router.delete('/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (isDbConnected()) {
      await query('DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2', [req.user.id, productId]);
    } else {
      memoryDb.wishlist = memoryDb.wishlist.filter(w => !(w.user_id === req.user.id && w.product_id === productId));
    }
    res.json({ message: 'Removed from wishlist.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from wishlist.' });
  }
});

module.exports = router;
