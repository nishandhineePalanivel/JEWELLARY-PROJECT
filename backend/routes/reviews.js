const express = require('express');
const router = express.Router();
const { isDbConnected, query, memoryDb } = require('../db');
const { authenticateToken } = require('../middleware/auth');

// POST /api/reviews
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating) {
      return res.status(400).json({ error: 'Product ID and rating (1-5) are required.' });
    }

    if (isDbConnected()) {
      const { rows } = await query(
        `INSERT INTO reviews (product_id, user_id, user_name, rating, comment)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [productId, req.user.id, req.user.name, rating, comment || '']
      );

      // Recalculate average rating for product
      await query(
        `UPDATE products SET rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE product_id = $1) WHERE id = $1`,
        [productId]
      );

      res.status(201).json(rows[0]);
    } else {
      const newReview = {
        id: memoryDb.reviews.length + 1,
        product_id: parseInt(productId, 10),
        user_id: req.user.id,
        user_name: req.user.name,
        rating: parseInt(rating, 10),
        comment: comment || '',
        created_at: new Date()
      };
      memoryDb.reviews.push(newReview);
      res.status(201).json(newReview);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit review.' });
  }
});

module.exports = router;
