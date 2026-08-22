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

// Shared placeholder images reused across new products until unique photos
// are sourced — search this file for "TODO: unique image" to find every
// product that still needs a real, distinct photo before launch.
const RING_IMG = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80';
const RING_IMG_2 = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80';
const EARRING_IMG = 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80';
const EARRING_IMG_2 = 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?auto=format&fit=crop&w=800&q=80';
const NECKLACE_IMG = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80';
const NECKLACE_IMG_2 = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80';
const BANGLE_IMG = 'https://images.unsplash.com/photo-1690175867343-2af70ea57537?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmFuZ2xlfGVufDB8fDB8fHww';
const BRACELET_IMG = 'https://images.unsplash.com/photo-1611591475777-233cd7a772b1?auto=format&fit=crop&w=800&q=80';
const PENDANT_IMG = 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80';

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
    // ---------------- ORIGINAL 9 PRODUCTS (unchanged) ----------------
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
       'https://images.unsplash.com/photo-1690175867343-2af70ea57537?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmFuZ2xlfGVufDB8fDB8fHww'
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
    },

    // ---------------- 51 NEW PRODUCTS ----------------
    // RINGS
    { id: 10, sku: 'NJ-RNG-010', name: 'Elegant Rose Gold Solitaire Ring', description: 'A minimal rose-gold solitaire ring designed for elegant everyday wear.', price: 24999, discount_percent: 17, category: 'Rings', material: '18k Rose Gold', weight_grams: 3.2, stock: 15, rating: 4.8, is_featured: true, images: [RING_IMG] }, // TODO: unique image
    { id: 11, sku: 'NJ-RNG-011', name: 'Classic 22K Gold Band Ring', description: 'A timeless plain gold band, polished for a smooth everyday finish.', price: 18999, discount_percent: 0, category: 'Rings', material: '22k Yellow Gold', weight_grams: 4.1, stock: 22, rating: 4.6, is_featured: false, images: [RING_IMG_2] }, // TODO: unique image
    { id: 12, sku: 'NJ-RNG-012', name: 'Traditional Kundan Statement Ring', description: 'Hand-set kundan stonework in a traditional Indian bridal silhouette.', price: 15999, discount_percent: 11, category: 'Rings', material: 'Gold-Plated Silver · Kundan', weight_grams: 5.6, stock: 18, rating: 4.5, is_featured: false, images: [RING_IMG] }, // TODO: unique image
    { id: 13, sku: 'NJ-RNG-013', name: 'Silver Minimalist Stackable Ring', description: 'A slim, stackable band for layering — everyday minimal styling.', price: 2499, discount_percent: 17, category: 'Rings', material: '925 Sterling Silver', weight_grams: 1.8, stock: 40, rating: 4.4, is_featured: false, images: [RING_IMG_2] }, // TODO: unique image
    { id: 14, sku: 'NJ-RNG-014', name: 'Emerald Gemstone Cocktail Ring', description: 'A bold emerald centrepiece set in warm 18K gold for statement occasions.', price: 34999, discount_percent: 13, category: 'Rings', material: '18k Gold · Emerald', weight_grams: 6.2, stock: 10, rating: 4.7, is_featured: false, images: [RING_IMG] }, // TODO: unique image
    { id: 15, sku: 'NJ-RNG-015', name: 'Pearl Accent Promise Ring', description: 'A single freshwater pearl set gently on a delicate gold band.', price: 8999, discount_percent: 10, category: 'Rings', material: '14k Gold · Pearl', weight_grams: 2.4, stock: 25, rating: 4.6, is_featured: false, images: [RING_IMG_2] }, // TODO: unique image
    { id: 16, sku: 'NJ-RNG-016', name: 'Bridal Diamond Eternity Ring', description: 'A full eternity band of pavé diamonds set in platinum for bridal wear.', price: 129999, discount_percent: 10, category: 'Rings', material: 'Platinum · Diamond', weight_grams: 4.5, stock: 6, rating: 4.9, is_featured: true, images: [RING_IMG] }, // TODO: unique image
    { id: 17, sku: 'NJ-RNG-017', name: 'Ruby Traditional Temple Ring', description: 'A ruby-studded ring inspired by South Indian temple jewellery motifs.', price: 22999, discount_percent: 12, category: 'Rings', material: '22k Gold · Ruby', weight_grams: 5.0, stock: 14, rating: 4.6, is_featured: false, images: [RING_IMG_2] }, // TODO: unique image

    // NECKLACES
    { id: 18, sku: 'NJ-NCK-018', name: 'Gold Layered Chain Necklace', description: 'Two delicate gold chains layered for a modern, everyday statement.', price: 27999, discount_percent: 13, category: 'Necklaces', material: '22k Gold', weight_grams: 12.5, stock: 12, rating: 4.7, is_featured: false, images: [NECKLACE_IMG] }, // TODO: unique image
    { id: 19, sku: 'NJ-NCK-019', name: 'Diamond Solitaire Pendant Necklace', description: 'A single brilliant diamond suspended on a fine white-gold chain.', price: 45999, discount_percent: 8, category: 'Necklaces', material: '18k White Gold · Diamond', weight_grams: 3.1, stock: 9, rating: 4.8, is_featured: true, images: [NECKLACE_IMG_2] }, // TODO: unique image
    { id: 20, sku: 'NJ-NCK-020', name: 'Traditional Kundan Choker Necklace', description: 'An intricately hand-set kundan choker for festive and bridal wear.', price: 32999, discount_percent: 13, category: 'Necklaces', material: 'Gold-Plated Brass · Kundan', weight_grams: 45, stock: 7, rating: 4.6, is_featured: false, images: [NECKLACE_IMG] }, // TODO: unique image
    { id: 21, sku: 'NJ-NCK-021', name: 'Classic Pearl Strand Necklace', description: 'A single strand of lustrous freshwater pearls, classic and versatile.', price: 18999, discount_percent: 10, category: 'Necklaces', material: 'Freshwater Pearl', weight_grams: 22, stock: 16, rating: 4.7, is_featured: false, images: [NECKLACE_IMG_2] }, // TODO: unique image
    { id: 22, sku: 'NJ-NCK-022', name: 'Rose Gold Delicate Necklace', description: 'A fine rose-gold chain with a small geometric pendant.', price: 9999, discount_percent: 13, category: 'Necklaces', material: '18k Rose Gold', weight_grams: 2.8, stock: 30, rating: 4.5, is_featured: false, images: [NECKLACE_IMG] }, // TODO: unique image
    { id: 23, sku: 'NJ-NCK-023', name: 'Emerald Statement Necklace', description: 'A bold emerald-and-gold necklace built for evening statement wear.', price: 58999, discount_percent: 9, category: 'Necklaces', material: '18k Gold · Emerald', weight_grams: 18, stock: 5, rating: 4.8, is_featured: true, images: [NECKLACE_IMG_2] }, // TODO: unique image
    { id: 24, sku: 'NJ-NCK-024', name: 'Silver Minimalist Necklace', description: 'A slim silver chain with a tiny charm — everyday minimal wear.', price: 3499, discount_percent: 13, category: 'Necklaces', material: '925 Sterling Silver', weight_grams: 3.5, stock: 45, rating: 4.4, is_featured: false, images: [NECKLACE_IMG] }, // TODO: unique image
    { id: 25, sku: 'NJ-NCK-025', name: 'Bridal Polki Necklace', description: 'An uncut-diamond polki necklace crafted for bridal ceremonies.', price: 74999, discount_percent: 10, category: 'Necklaces', material: '22k Gold · Polki', weight_grams: 52, stock: 4, rating: 4.9, is_featured: true, images: [NECKLACE_IMG_2] }, // TODO: unique image
    { id: 26, sku: 'NJ-NCK-026', name: 'Antique Temple Necklace', description: 'An antique-finish necklace featuring traditional temple deity motifs.', price: 41999, discount_percent: 11, category: 'Necklaces', material: '22k Gold', weight_grams: 38, stock: 8, rating: 4.7, is_featured: false, images: [NECKLACE_IMG] }, // TODO: unique image

    // EARRINGS
    { id: 27, sku: 'NJ-EAR-027', name: 'Gold Jhumka Earrings', description: 'Classic bell-shaped jhumkas with fine gold filigree work.', price: 12999, discount_percent: 13, category: 'Earrings', material: '22k Gold', weight_grams: 8.5, stock: 20, rating: 4.7, is_featured: false, images: [EARRING_IMG] }, // TODO: unique image
    { id: 28, sku: 'NJ-EAR-028', name: 'Silver Hoop Earrings', description: 'Classic medium-sized silver hoops for daily wear.', price: 1999, discount_percent: 20, category: 'Earrings', material: '925 Sterling Silver', weight_grams: 3.2, stock: 50, rating: 4.4, is_featured: false, images: [EARRING_IMG_2] }, // TODO: unique image
    { id: 29, sku: 'NJ-EAR-029', name: 'Rose Gold Huggie Earrings', description: 'Small, close-fitting huggie hoops in warm rose gold.', price: 4499, discount_percent: 10, category: 'Earrings', material: '18k Rose Gold', weight_grams: 1.9, stock: 38, rating: 4.5, is_featured: false, images: [EARRING_IMG] }, // TODO: unique image
    { id: 30, sku: 'NJ-EAR-030', name: 'Kundan Chandbali Earrings', description: 'Crescent-shaped chandbali earrings with hand-set kundan stones.', price: 9999, discount_percent: 17, category: 'Earrings', material: 'Gold-Plated Brass · Kundan', weight_grams: 10.2, stock: 15, rating: 4.6, is_featured: false, images: [EARRING_IMG_2] }, // TODO: unique image
    { id: 31, sku: 'NJ-EAR-031', name: 'Emerald Drop Earrings', description: 'Emerald drops framed in gold for a rich pop of colour.', price: 27999, discount_percent: 13, category: 'Earrings', material: '18k Gold · Emerald', weight_grams: 4.8, stock: 9, rating: 4.7, is_featured: false, images: [EARRING_IMG] }, // TODO: unique image
    { id: 32, sku: 'NJ-EAR-032', name: 'Traditional Gold Danglers', description: 'Long, intricately worked gold danglers for festive occasions.', price: 15999, discount_percent: 11, category: 'Earrings', material: '22k Gold', weight_grams: 6.7, stock: 17, rating: 4.6, is_featured: false, images: [EARRING_IMG_2] }, // TODO: unique image
    { id: 33, sku: 'NJ-EAR-033', name: 'Minimalist Ear Cuffs', description: 'No-piercing-needed ear cuffs for a subtle modern edge.', price: 1499, discount_percent: 17, category: 'Earrings', material: '925 Sterling Silver', weight_grams: 1.1, stock: 42, rating: 4.3, is_featured: false, images: [EARRING_IMG] }, // TODO: unique image
    { id: 34, sku: 'NJ-EAR-034', name: 'Bridal Polki Earrings', description: 'Statement polki earrings designed to match bridal necklace sets.', price: 38999, discount_percent: 9, category: 'Earrings', material: '22k Gold · Polki', weight_grams: 14, stock: 6, rating: 4.9, is_featured: true, images: [EARRING_IMG_2] }, // TODO: unique image

    // BRACELETS
    { id: 35, sku: 'NJ-BRC-035', name: 'Gold Cuban Link Bracelet', description: 'A bold cuban-link chain bracelet with a secure clasp.', price: 21999, discount_percent: 12, category: 'Bracelets', material: '18k Gold', weight_grams: 9.4, stock: 14, rating: 4.6, is_featured: false, images: [BRACELET_IMG] }, // TODO: unique image
    { id: 36, sku: 'NJ-BRC-036', name: 'Silver Charm Bracelet', description: 'A playful charm bracelet with three interchangeable charms.', price: 2999, discount_percent: 14, category: 'Bracelets', material: '925 Sterling Silver', weight_grams: 5.0, stock: 35, rating: 4.4, is_featured: false, images: [BRACELET_IMG] }, // TODO: unique image
    { id: 37, sku: 'NJ-BRC-037', name: 'Rose Gold Bangle-Style Bracelet', description: 'A rigid open-cuff bracelet with a smooth rose-gold finish.', price: 8999, discount_percent: 10, category: 'Bracelets', material: '18k Rose Gold', weight_grams: 4.2, stock: 22, rating: 4.5, is_featured: false, images: [BRACELET_IMG] }, // TODO: unique image
    { id: 38, sku: 'NJ-BRC-038', name: 'Pearl Beaded Bracelet', description: 'Hand-strung freshwater pearls on a stretch cord.', price: 3999, discount_percent: 11, category: 'Bracelets', material: 'Freshwater Pearl', weight_grams: 6.5, stock: 27, rating: 4.5, is_featured: false, images: [BRACELET_IMG] }, // TODO: unique image
    { id: 39, sku: 'NJ-BRC-039', name: 'Traditional Gold Kada Bracelet', description: 'A sturdy, engraved kada-style bracelet rooted in traditional design.', price: 33999, discount_percent: 11, category: 'Bracelets', material: '22k Gold', weight_grams: 16, stock: 8, rating: 4.7, is_featured: false, images: [BRACELET_IMG] }, // TODO: unique image
    { id: 40, sku: 'NJ-BRC-040', name: 'Gemstone Chain Bracelet', description: 'Small coloured gemstones set along a fine gold chain.', price: 11999, discount_percent: 11, category: 'Bracelets', material: '18k Gold · Mixed Gemstone', weight_grams: 4.0, stock: 19, rating: 4.4, is_featured: false, images: [BRACELET_IMG] }, // TODO: unique image
    { id: 41, sku: 'NJ-BRC-041', name: 'Minimalist Chain Bracelet', description: 'A thin everyday chain bracelet with an adjustable clasp.', price: 1799, discount_percent: 10, category: 'Bracelets', material: '925 Sterling Silver', weight_grams: 2.1, stock: 48, rating: 4.3, is_featured: false, images: [BRACELET_IMG] }, // TODO: unique image

    // BANGLES
    { id: 42, sku: 'NJ-BNG-042', name: 'Diamond Studded Bangle', description: 'A gold bangle inset with a row of sparkling diamonds.', price: 79999, discount_percent: 8, category: 'Bangles', material: '18k Gold · Diamond', weight_grams: 14, stock: 4, rating: 4.8, is_featured: true, images: [BANGLE_IMG] }, // TODO: unique image
    { id: 43, sku: 'NJ-BNG-043', name: 'Silver Oxidized Bangle', description: 'An oxidized-finish bangle with traditional carved patterns.', price: 3499, discount_percent: 13, category: 'Bangles', material: '925 Sterling Silver', weight_grams: 12, stock: 30, rating: 4.4, is_featured: false, images: [BANGLE_IMG] }, // TODO: unique image
    { id: 44, sku: 'NJ-BNG-044', name: 'Rose Gold Slim Bangle', description: 'A slim, smooth rose-gold bangle for everyday stacking.', price: 13999, discount_percent: 10, category: 'Bangles', material: '18k Rose Gold', weight_grams: 8, stock: 16, rating: 4.5, is_featured: false, images: [BANGLE_IMG] }, // TODO: unique image
    { id: 45, sku: 'NJ-BNG-045', name: 'Kundan Bridal Bangle', description: 'An ornate kundan-studded bangle made for bridal sets.', price: 54999, discount_percent: 8, category: 'Bangles', material: '22k Gold · Kundan', weight_grams: 22, stock: 5, rating: 4.8, is_featured: false, images: [BANGLE_IMG] }, // TODO: unique image
    { id: 46, sku: 'NJ-BNG-046', name: 'Everyday Gold Bangle', description: 'A lightweight, comfortable gold bangle for daily wear.', price: 23999, discount_percent: 0, category: 'Bangles', material: '18k Gold', weight_grams: 10, stock: 20, rating: 4.5, is_featured: false, images: [BANGLE_IMG] }, // TODO: unique image
    { id: 47, sku: 'NJ-BNG-047', name: 'Traditional Gold Bangle', description: 'A classic solid gold bangle with fine engraved detailing.', price: 42999, discount_percent: 9, category: 'Bangles', material: '22k Gold', weight_grams: 18, stock: 10, rating: 4.7, is_featured: false, images: [BANGLE_IMG] }, // TODO: unique image

    // PENDANTS
    { id: 48, sku: 'NJ-PND-048', name: 'Emerald Halo Pendant', description: 'An emerald centre stone ringed by a delicate diamond halo.', price: 19999, discount_percent: 13, category: 'Pendants', material: '18k Gold · Emerald', weight_grams: 2.9, stock: 12, rating: 4.6, is_featured: false, images: [PENDANT_IMG] }, // TODO: unique image
    { id: 49, sku: 'NJ-PND-049', name: 'Pearl Drop Pendant', description: 'A single lustrous pearl suspended on a simple gold bail.', price: 4999, discount_percent: 9, category: 'Pendants', material: '14k Gold · Pearl', weight_grams: 1.6, stock: 31, rating: 4.5, is_featured: false, images: [PENDANT_IMG] }, // TODO: unique image
    { id: 50, sku: 'NJ-PND-050', name: 'Traditional Temple Pendant', description: 'A temple-style pendant featuring traditional deity carving.', price: 12999, discount_percent: 10, category: 'Pendants', material: '22k Gold', weight_grams: 4.2, stock: 14, rating: 4.7, is_featured: true, images: [PENDANT_IMG] }, // TODO: unique image
    { id: 51, sku: 'NJ-PND-051', name: 'Rose Gold Heart Pendant', description: 'A softly curved heart pendant in warm rose gold.', price: 5999, discount_percent: 8, category: 'Pendants', material: '18k Rose Gold', weight_grams: 1.4, stock: 34, rating: 4.4, is_featured: false, images: [PENDANT_IMG] }, // TODO: unique image
    { id: 52, sku: 'NJ-PND-052', name: 'Gold Om Pendant', description: 'A finely detailed Om symbol pendant in solid gold.', price: 6999, discount_percent: 13, category: 'Pendants', material: '22k Gold', weight_grams: 2.5, stock: 26, rating: 4.6, is_featured: false, images: [PENDANT_IMG] }, // TODO: unique image

    // ANKLETS — new category, check schema.sql before deploying (see note below)
    { id: 53, sku: 'NJ-ANK-053', name: 'Silver Traditional Payal Anklet', description: 'A classic silver payal with small ghungroo bells.', price: 3999, discount_percent: 11, category: 'Anklets', material: '925 Sterling Silver', weight_grams: 14, stock: 24, rating: 4.6, is_featured: false, images: [BANGLE_IMG] }, // TODO: unique image
    { id: 54, sku: 'NJ-ANK-054', name: 'Gold Beaded Anklet', description: 'Fine gold beadwork on an adjustable anklet chain.', price: 8999, discount_percent: 10, category: 'Anklets', material: '18k Gold', weight_grams: 5.5, stock: 15, rating: 4.5, is_featured: false, images: [BANGLE_IMG] }, // TODO: unique image
    { id: 55, sku: 'NJ-ANK-055', name: 'Pearl Charm Anklet', description: 'Small pearl charms strung along a delicate silver chain.', price: 2999, discount_percent: 14, category: 'Anklets', material: 'Freshwater Pearl', weight_grams: 4.8, stock: 20, rating: 4.4, is_featured: false, images: [BANGLE_IMG] }, // TODO: unique image
    { id: 56, sku: 'NJ-ANK-056', name: 'Oxidized Silver Anklet', description: 'A carved oxidized-silver anklet in traditional patterning.', price: 2499, discount_percent: 11, category: 'Anklets', material: '925 Sterling Silver', weight_grams: 11, stock: 28, rating: 4.5, is_featured: false, images: [BANGLE_IMG] }, // TODO: unique image
    { id: 57, sku: 'NJ-ANK-057', name: 'Minimalist Chain Anklet', description: 'A thin everyday anklet chain with a tiny star charm.', price: 1499, discount_percent: 12, category: 'Anklets', material: '925 Sterling Silver', weight_grams: 2.0, stock: 40, rating: 4.3, is_featured: false, images: [BANGLE_IMG] }, // TODO: unique image

    // JEWELLERY SETS — new category, check schema.sql before deploying (see note below)
    { id: 58, sku: 'NJ-SET-058', name: 'Gold Temple Jewellery Set', description: 'A temple-motif necklace and earring set for festive occasions.', price: 67999, discount_percent: 9, category: 'Jewellery Sets', material: '22k Gold', weight_grams: 54, stock: 6, rating: 4.8, is_featured: false, images: [NECKLACE_IMG] }, // TODO: unique image
    { id: 59, sku: 'NJ-SET-059', name: 'Pearl Necklace & Earring Set', description: 'A matching pearl necklace and earring set for everyday elegance.', price: 15999, discount_percent: 11, category: 'Jewellery Sets', material: 'Freshwater Pearl', weight_grams: 26, stock: 17, rating: 4.6, is_featured: false, images: [NECKLACE_IMG_2] }, // TODO: unique image
    { id: 60, sku: 'NJ-SET-060', name: 'Diamond Wedding Jewellery Set', description: 'A coordinated diamond necklace, earring, and ring set for weddings.', price: 189999, discount_percent: 10, category: 'Jewellery Sets', material: '18k White Gold · Diamond', weight_grams: 22, stock: 2, rating: 4.9, is_featured: true, images: [NECKLACE_IMG] } // TODO: unique image
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
