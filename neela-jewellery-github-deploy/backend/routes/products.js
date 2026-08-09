const express = require('express');
const router = express.Router();
const { isDbConnected, query, memoryDb } = require('../db');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, material, search, minPrice, maxPrice, sort, featured } = req.query;

    if (isDbConnected()) {
      let sql = `
        SELECT p.*, COALESCE(
          json_agg(
            json_build_object('id', pi.id, 'image_url', pi.image_url, 'is_primary', pi.is_primary)
          ) FILTER (WHERE pi.id IS NOT NULL), '[]'
        ) AS images
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE 1=1
      `;
      const params = [];

      if (category && category !== 'All') {
        params.push(category);
        sql += ` AND p.category = $${params.length}`;
      }

      if (material) {
        params.push(`%${material}%`);
        sql += ` AND p.material ILIKE $${params.length}`;
      }

      if (search) {
        params.push(`%${search}%`);
        sql += ` AND (p.name ILIKE $${params.length} OR p.description ILIKE $${params.length} OR p.category ILIKE $${params.length})`;
      }

      if (minPrice) {
        params.push(parseFloat(minPrice));
        sql += ` AND p.price >= $${params.length}`;
      }

      if (maxPrice) {
        params.push(parseFloat(maxPrice));
        sql += ` AND p.price <= $${params.length}`;
      }

      if (featured === 'true') {
        sql += ` AND p.is_featured = true`;
      }

      sql += ` GROUP BY p.id`;

      if (sort === 'price-low') {
        sql += ` ORDER BY p.price ASC`;
      } else if (sort === 'price-high') {
        sql += ` ORDER BY p.price DESC`;
      } else if (sort === 'rating') {
        sql += ` ORDER BY p.rating DESC`;
      } else {
        sql += ` ORDER BY p.id DESC`;
      }

      const { rows } = await query(sql, params);
      res.json(rows);
    } else {
      let list = [...memoryDb.products];

      if (category && category !== 'All') {
        list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }

      if (material) {
        list = list.filter(p => p.material.toLowerCase().includes(material.toLowerCase()));
      }

      if (search) {
        const q = search.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      }

      if (minPrice) {
        list = list.filter(p => p.price >= parseFloat(minPrice));
      }

      if (maxPrice) {
        list = list.filter(p => p.price <= parseFloat(maxPrice));
      }

      if (featured === 'true') {
        list = list.filter(p => p.is_featured);
      }

      if (sort === 'price-low') {
        list.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        list.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        list.sort((a, b) => b.rating - a.rating);
      }

      res.json(list);
    }
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// GET /api/products/categories
router.get('/categories', async (req, res) => {
  res.json(['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles', 'Pendants']);
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const prodId = req.params.id;

    if (isDbConnected()) {
      const { rows } = await query(
        `SELECT p.*, COALESCE(
          json_agg(
            json_build_object('id', pi.id, 'image_url', pi.image_url, 'is_primary', pi.is_primary)
          ) FILTER (WHERE pi.id IS NOT NULL), '[]'
        ) AS images
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.id = $1
        GROUP BY p.id`,
        [prodId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      const product = rows[0];

      // Fetch reviews
      const { rows: reviews } = await query(
        'SELECT * FROM reviews WHERE product_id = $1 ORDER BY id DESC',
        [prodId]
      );

      product.reviews = reviews;
      res.json(product);
    } else {
      const product = memoryDb.products.find(p => String(p.id) === String(prodId) || p.sku === prodId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      const reviews = memoryDb.reviews.filter(r => String(r.product_id) === String(product.id));
      res.json({ ...product, reviews });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product details.' });
  }
});

module.exports = router;
