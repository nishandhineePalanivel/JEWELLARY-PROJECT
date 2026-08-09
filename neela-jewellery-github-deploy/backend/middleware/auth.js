const jwt = require('jsonwebtoken');
const { isDbConnected, query, memoryDb } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'neela_jewellery_super_secret_jwt_key_2026';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (isDbConnected()) {
      const { rows } = await query('SELECT id, name, email, role, phone FROM users WHERE id = $1', [decoded.id]);
      if (rows.length === 0) {
        return res.status(401).json({ error: 'User account no longer exists.' });
      }
      req.user = rows[0];
    } else {
      const user = memoryDb.users.find(u => u.id === decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'User account no longer exists.' });
      }
      req.user = { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone };
    }

    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired authentication token.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (isDbConnected()) {
      const { rows } = await query('SELECT id, name, email, role, phone FROM users WHERE id = $1', [decoded.id]);
      req.user = rows[0] || null;
    } else {
      const user = memoryDb.users.find(u => u.id === decoded.id);
      req.user = user ? { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone } : null;
    }
  } catch (e) {
    req.user = null;
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth,
  JWT_SECRET
};
