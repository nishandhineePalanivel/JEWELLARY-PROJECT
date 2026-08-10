const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isDbConnected, query, memoryDb } = require('../db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    if (isDbConnected()) {
      const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'An account with this email already exists.' });
      }

      const { rows } = await query(
        'INSERT INTO users (name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, phone',
        [name, email.toLowerCase(), passwordHash, 'customer', phone || '']
      );

      const user = rows[0];
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({ token, user });
    } else {
      const existing = memoryDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ error: 'An account with this email already exists.' });
      }

      const newUser = {
        id: memoryDb.users.length + 1,
        name,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        role: 'customer',
        phone: phone || '',
        created_at: new Date()
      };
      memoryDb.users.push(newUser);

      const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
      const userRes = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, phone: newUser.phone };

      return res.status(201).json({ token, user: userRes });
    }
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error registering user.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    let user = null;

    if (isDbConnected()) {
      const { rows } = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
      if (rows.length > 0) user = rows[0];
    } else {
      user = memoryDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const userRes = { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone };

    res.json({ token, user: userRes });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error logging in.' });
  }
});

// GET /api/auth/profile
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// GET /api/auth/addresses
router.get('/addresses', authenticateToken, async (req, res) => {
  try {
    if (isDbConnected()) {
      const { rows } = await query('SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, id DESC', [req.user.id]);
      res.json(rows);
    } else {
      const userAddresses = memoryDb.addresses.filter(a => a.user_id === req.user.id);
      res.json(userAddresses);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch addresses.' });
  }
});

// POST /api/auth/addresses
router.post('/addresses', authenticateToken, async (req, res) => {
  try {
    const { full_name, phone, address_line1, address_line2, city, state, pincode, is_default } = req.body;
    if (!full_name || !phone || !address_line1 || !city || !state || !pincode) {
      return res.status(400).json({ error: 'Please provide all required address fields.' });
    }

    if (isDbConnected()) {
      if (is_default) {
        await query('UPDATE addresses SET is_default = false WHERE user_id = $1', [req.user.id]);
      }
      const { rows } = await query(
        `INSERT INTO addresses (user_id, full_name, phone, address_line1, address_line2, city, state, pincode, is_default)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [req.user.id, full_name, phone, address_line1, address_line2 || '', city, state, pincode, !!is_default]
      );
      res.status(201).json(rows[0]);
    } else {
      if (is_default) {
        memoryDb.addresses.forEach(a => { if (a.user_id === req.user.id) a.is_default = false; });
      }
      const newAddr = {
        id: memoryDb.addresses.length + 1,
        user_id: req.user.id,
        full_name, phone, address_line1, address_line2: address_line2 || '', city, state, pincode, is_default: !!is_default
      };
      memoryDb.addresses.push(newAddr);
      res.status(201).json(newAddr);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to save address.' });
  }
});

module.exports = router;
