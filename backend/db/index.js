const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const isProduction = process.env.NODE_ENV === 'production';

// PostgreSQL Pool configuration
const poolConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'neela_jewellery',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  connectionTimeoutMillis: 3000,
};

let pool = null;
let dbConnected = false;

// Fallback In-Memory Datastore for instant evaluation if PostgreSQL is not active
const memoryDb = {
  users: [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@neelajewellery.com',
      password_hash: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      phone: '+91 9876543210',
      created_at: new Date()
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password_hash: bcrypt.hashSync('customer123', 10),
      role: 'customer',
      phone: '+91 9812345678',
      created_at: new Date()
    }
  ],
  products: [
    {
      id: 1,
      sku: 'NJ-RNG-001',
      name: 'Vellai Solitaire Diamond Ring',
      description: 'A breathtaking 0.75ct round-brilliant diamond solitaire set in polished 18k yellow gold band. Timeless elegance crafted for everyday luxury and engagements.',
      price: 49999,
      discount_percent: 10,
      category: 'Rings',
      material: '18k Gold · 0.75ct VVS Diamond',
      weight_grams: 4.2,
      stock: 15,
      rating: 4.9,
      is_featured: true,
      images: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 2,
      sku: 'NJ-EAR-002',
      name: 'Kanni Ruby Drop Earrings',
      description: 'Handcrafted 22k yellow gold earrings featuring vivid natural pigeon-blood teardrop rubies enclosed in intricate filigree borders.',
      price: 28499,
      discount_percent: 15,
      category: 'Earrings',
      material: '22k Gold · Natural Ruby',
      weight_grams: 8.5,
      stock: 10,
      rating: 4.8,
      is_featured: true,
      images: [
        'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 3,
      sku: 'NJ-NCK-003',
      name: 'Nila Crescent Gold Chain Necklace',
      description: 'Fluid 18k solid gold curb chain holding a hand-textured crescent moon pendant set with micro-pave accent diamonds.',
      price: 38999,
      discount_percent: 5,
      category: 'Necklaces',
      material: '18k Solid Yellow Gold',
      weight_grams: 14.1,
      stock: 8,
      rating: 4.9,
      is_featured: true,
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 4,
      sku: 'NJ-BNG-004',
      name: 'Thangam Hand-Hammered Gold Bangles',
      description: 'Set of 2 royal 22k gold bangles with delicate hand-engraved floral motifs. Designed for traditional celebrations and modern stacking.',
      price: 65999,
      discount_percent: 12,
      category: 'Bangles',
      material: '22k Gold · Set of 2',
      weight_grams: 26.0,
      stock: 6,
      rating: 5.0,
      is_featured: true,
      images: [
        'https://images.unsplash.com/photo-1611591475777-233cd7a772b1?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 5,
      sku: 'NJ-RNG-005',
      name: 'Mayil Royal Emerald Halo Ring',
      description: 'A deep green Zambian oval emerald surrounded by a brilliant halo of pavé diamonds set in 18k white gold.',
      price: 52499,
      discount_percent: 8,
      category: 'Rings',
      material: '18k White Gold · Zambian Emerald',
      weight_grams: 5.1,
      stock: 4,
      rating: 4.7,
      is_featured: true,
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 6,
      sku: 'NJ-EAR-006',
      name: 'Arasi South Sea Pearl Studs',
      description: 'Lustrous AAA Grade freshwater white pearls mounted on hypoallergenic 18k white gold posts with secure push backs.',
      price: 14999,
      discount_percent: 0,
      category: 'Earrings',
      material: '18k White Gold · AAA Pearl',
      weight_grams: 3.8,
      stock: 20,
      rating: 4.9,
      is_featured: false,
      images: [
        'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 7,
      sku: 'NJ-NCK-007',
      name: 'Ponnusai Two-Tier Layered Gold Choker',
      description: 'Double strand 18k yellow gold necklace with polished coin drops that catch light from every angle.',
      price: 44999,
      discount_percent: 10,
      category: 'Necklaces',
      material: '18k Yellow Gold',
      weight_grams: 18.5,
      stock: 7,
      rating: 4.8,
      is_featured: false,
      images: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 8,
      sku: 'NJ-BRC-008',
      name: 'Vairam Diamond Line Tennis Bracelet',
      description: 'A seamless row of 48 round brilliant cut diamonds totaling 2.5ctw, claw-set in platinum.',
      price: 89999,
      discount_percent: 20,
      category: 'Bracelets',
      material: 'Platinum 950 · 2.5ct Diamond',
      weight_grams: 12.4,
      stock: 3,
      rating: 5.0,
      is_featured: true,
      images: [
        'https://images.unsplash.com/photo-1611591475777-233cd7a772b1?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 9,
      sku: 'NJ-PND-009',
      name: 'Ganesha Divine Gold Pendant',
      description: 'Intricately molded Lord Ganesha pendant in 24k pure gold foil over 22k gold base with ruby eye accents.',
      price: 21999,
      discount_percent: 5,
      category: 'Pendants',
      material: '22k Yellow Gold · Ruby Accent',
      weight_grams: 6.2,
      stock: 12,
      rating: 4.9,
      is_featured: false,
      images: [
        'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80'
      ]
    }
  ],
  addresses: [
    {
      id: 1,
      user_id: 2,
      full_name: 'Priya Sharma',
      phone: '9812345678',
      address_line1: 'Flat 402, Royal Residency',
      address_line2: 'MG Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      is_default: true
    }
  ],
  cart_items: [],
  wishlist: [],
  orders: [],
  payments: [],
  reviews: [
    {
      id: 1,
      product_id: 1,
      user_id: 2,
      user_name: 'Priya S.',
      rating: 5,
      comment: 'Exquisite clarity and craft! The gold finish is mesmerizing.',
      created_at: new Date()
    }
  ]
};

async function initDb() {
  try {
    pool = new Pool(poolConfig);
    const client = await pool.connect();
    console.log('PostgreSQL Connected Successfully!');
    dbConnected = true;

    // Read and run schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log('Database Schema Verified/Initialized.');
    }

    // Seed initial products if empty
    const { rows: existingProducts } = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(existingProducts[0].count, 10) === 0) {
      console.log('Seeding initial products into PostgreSQL...');
      for (const p of memoryDb.products) {
        const prodRes = await client.query(
          `INSERT INTO products (sku, name, description, price, discount_percent, category, material, weight_grams, stock, rating, is_featured)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
          [p.sku, p.name, p.description, p.price, p.discount_percent, p.category, p.material, p.weight_grams, p.stock, p.rating, p.is_featured]
        );
        const prodId = prodRes.rows[0].id;
        for (let idx = 0; idx < p.images.length; idx++) {
          await client.query(
            `INSERT INTO product_images (product_id, image_url, is_primary) VALUES ($1, $2, $3)`,
            [prodId, p.images[idx], idx === 0]
          );
        }
      }
    }

    // Seed initial users if empty
    const { rows: existingUsers } = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(existingUsers[0].count, 10) === 0) {
      console.log('Seeding default users into PostgreSQL...');
      for (const u of memoryDb.users) {
        await client.query(
          `INSERT INTO users (name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5)`,
          [u.name, u.email, u.password_hash, u.role, u.phone]
        );
      }
    }

    client.release();
  } catch (err) {
    console.warn('⚠️ PostgreSQL connection failed:', err.message);
    console.warn('⚡ Using robust In-Memory Data Store fallback for seamless execution!');
    dbConnected = false;
  }
}

// Execute connection test
initDb();

module.exports = {
  isDbConnected: () => dbConnected,
  query: async (text, params) => {
    if (dbConnected && pool) {
      return pool.query(text, params);
    }
    throw new Error('Database pool not connected');
  },
  memoryDb
};
