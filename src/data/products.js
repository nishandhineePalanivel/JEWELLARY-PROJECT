// src/data/products.js
// Full local jewellery catalogue — built from images already in src/assets/.
// No external URLs (Unsplash or otherwise) are used anywhere in this file.
//
// 59 products total:
//   Rings: 10  Necklaces: 10  Earrings: 10  Bangles: 9  Bracelets: 10  Pendants: 10
//
// IMPORTANT: every import below uses the EXACT filenames you listed, typos
// included (.jbg.jpg, .jbj.jpg, "bracelts", "pendents", "earrings2jpg.avif").
// If any filename doesn't match what's actually in src/assets/ byte-for-byte,
// the build will fail the same way the necklace.jpg import did — double check
// against your actual folder listing before committing.

// ---------------- RINGS ----------------
import ring1 from '../assets/ring1.jpg';
import ring2 from '../assets/ring2.jpg';
import ring3 from '../assets/ring3.jpg';
import rings4 from '../assets/rings4.jpg';
import rings5 from '../assets/rings5.jpg';
import rings6 from '../assets/rings6.jpg';
import rings7 from '../assets/rings7.jpg';
import rings8 from '../assets/rings8.jbj.jpg';
import rings9 from '../assets/rings9.jbg.jpg';
import rings10 from '../assets/rings10.jbg.jpg';

// ---------------- NECKLACES ----------------
import necklace1 from '../assets/necklace1.jpg';
import necklace2 from '../assets/necklace2.jpg';
import necklace3 from '../assets/necklace3.jpg';
import necklace4 from '../assets/necklace4.jpg';
import necklace5 from '../assets/necklace5.jpg';
import necklace6 from '../assets/necklace6.jpg';
import necklace7 from '../assets/necklace7.jpg';
import necklace8 from '../assets/necklace8.jpg';
import necklace9 from '../assets/necklace9.jpg';
import necklace10 from '../assets/necklace10.jpg';

// ---------------- EARRINGS ----------------
import earrings1 from '../assets/earrings1.jbg.jpg';
import earrings2 from '../assets/earrings2jpg.avif';
import earrings3 from '../assets/earrings3jpg.jpg';
import earrings4 from '../assets/earrings4.jpg';
import earrings5 from '../assets/earrings5.jpg';
import earrings6 from '../assets/earrings6.jpg';
import earrings7 from '../assets/earrings7.jpg';
import earrings8 from '../assets/earrings8.jpg';
import earrings9 from '../assets/earrings9.jpg';
import earrings10 from '../assets/earrings10.jpg';

// ---------------- BANGLES (no bangles4 in your list) ----------------
import bangles1 from '../assets/bangles1.jbg.jpg';
import bangles2 from '../assets/bangles2.jpg';
import bangles3 from '../assets/bangles3.jpg';
import bangles5 from '../assets/bangles5.jpg';
import bangles6 from '../assets/bangles6.jpg';
import bangles7 from '../assets/bangles7.jpg';
import bangles8 from '../assets/bangles8.jpg';
import bangles9 from '../assets/bangles9.jpg';
import bangles10 from '../assets/bangles10.jpg';

// ---------------- BRACELETS ----------------
import bracelts1 from '../assets/bracelts1.jpg';
import bracelts2 from '../assets/bracelts2.jpg';
import bracelts3 from '../assets/bracelts3.jpg';
import bracelts4 from '../assets/bracelts4.jpg';
import bracelts5 from '../assets/bracelts5.jpg';
import bracelts6 from '../assets/bracelts6.jpg';
import bracelts7 from '../assets/bracelts7.jpg';
import bracelts8 from '../assets/bracelts8.jpg';
import bracelts9 from '../assets/bracelts9.jpg';
import bracelts10 from '../assets/bracelts10.jpg';

// ---------------- PENDANTS (no pendents2 in your list) ----------------
import pendents0 from '../assets/pendents.jpg';
import pendents1 from '../assets/pendents1.jpg';
import pendents3 from '../assets/pendents3.jpg';
import pendents4 from '../assets/pendents4.jpg';
import pendents5 from '../assets/pendents5.jpg';
import pendents6 from '../assets/pendents6.jpg';
import pendents7 from '../assets/pendents7.jpg';
import pendents8 from '../assets/pendents8.jpg';
import pendents9 from '../assets/pendents9.jpg';
import pendents10 from '../assets/pendents10.jpg';

const products = [
  // ==================== RINGS ====================
  { id: 'r01', name: 'Vellai Solitaire Diamond Ring', category: 'Rings', price: 49999, originalPrice: 54999, material: '18k Gold · Diamond', image: ring1, description: 'A breathtaking round-brilliant diamond solitaire set in polished 18k yellow gold.', rating: 4.9, reviews: 124, stock: 15 },
  { id: 'r02', name: 'Mayil Royal Emerald Halo Ring', category: 'Rings', price: 52499, originalPrice: 56999, material: '18k White Gold · Emerald', image: ring2, description: 'A deep green emerald surrounded by a brilliant halo of pavé diamonds.', rating: 4.7, reviews: 88, stock: 4 },
  { id: 'r03', name: 'Classic 22K Gold Band Ring', category: 'Rings', price: 18999, originalPrice: 18999, material: '22k Yellow Gold', image: ring3, description: 'A timeless plain gold band, polished for a smooth everyday finish.', rating: 4.6, reviews: 63, stock: 22 },
  { id: 'r04', name: 'Traditional Kundan Statement Ring', category: 'Rings', price: 15999, originalPrice: 17999, material: 'Gold-Plated Silver · Kundan', image: rings4, description: 'Hand-set kundan stonework in a traditional Indian bridal silhouette.', rating: 4.5, reviews: 47, stock: 18 },
  { id: 'r05', name: 'Silver Minimalist Stackable Ring', category: 'Rings', price: 2499, originalPrice: 2999, material: '925 Sterling Silver', image: rings5, description: 'A slim, stackable band for layering — everyday minimal styling.', rating: 4.4, reviews: 156, stock: 40 },
  { id: 'r06', name: 'Rose Gold Twisted Band Ring', category: 'Rings', price: 11999, originalPrice: 13499, material: '18k Rose Gold', image: rings6, description: 'A modern twisted band with a soft rose-gold sheen.', rating: 4.5, reviews: 39, stock: 20 },
  { id: 'r07', name: 'Ruby Traditional Temple Ring', category: 'Rings', price: 22999, originalPrice: 25999, material: '22k Gold · Ruby', image: rings7, description: 'A ruby-studded ring inspired by South Indian temple jewellery motifs.', rating: 4.6, reviews: 54, stock: 14 },
  { id: 'r08', name: 'Pearl Accent Promise Ring', category: 'Rings', price: 8999, originalPrice: 9999, material: '14k Gold · Pearl', image: rings8, description: 'A single freshwater pearl set gently on a delicate gold band.', rating: 4.6, reviews: 71, stock: 25 },
  { id: 'r09', name: 'Bridal Diamond Eternity Ring', category: 'Rings', price: 129999, originalPrice: 144999, material: 'Platinum · Diamond', image: rings9, description: 'A full eternity band of pavé diamonds set in platinum for bridal wear.', rating: 4.9, reviews: 98, stock: 6 },
  { id: 'r10', name: 'Emerald Gemstone Cocktail Ring', category: 'Rings', price: 34999, originalPrice: 39999, material: '18k Gold · Emerald', image: rings10, description: 'A bold emerald centrepiece set in warm 18k gold for statement occasions.', rating: 4.7, reviews: 47, stock: 10 },

  // ==================== NECKLACES ====================
  { id: 'n01', name: 'Nila Crescent Gold Chain Necklace', category: 'Necklaces', price: 38999, originalPrice: 41999, material: '18k Solid Yellow Gold', image: necklace1, description: 'Fluid solid-gold curb chain holding a hand-textured crescent moon pendant.', rating: 4.9, reviews: 71, stock: 8 },
  { id: 'n02', name: 'Ponnusai Two-Tier Layered Gold Choker', category: 'Necklaces', price: 44999, originalPrice: 49999, material: '18k Yellow Gold', image: necklace2, description: 'Double strand gold necklace with polished coin drops that catch light from every angle.', rating: 4.8, reviews: 55, stock: 7 },
  { id: 'n03', name: 'Gold Layered Chain Necklace', category: 'Necklaces', price: 27999, originalPrice: 31999, material: '22k Gold', image: necklace3, description: 'Two delicate gold chains layered for a modern, everyday statement.', rating: 4.7, reviews: 102, stock: 12 },
  { id: 'n04', name: 'Diamond Solitaire Pendant Necklace', category: 'Necklaces', price: 45999, originalPrice: 49999, material: '18k White Gold · Diamond', image: necklace4, description: 'A single brilliant diamond suspended on a fine white-gold chain.', rating: 4.8, reviews: 133, stock: 9 },
  { id: 'n05', name: 'Traditional Kundan Choker Necklace', category: 'Necklaces', price: 32999, originalPrice: 37999, material: 'Gold-Plated Brass · Kundan', image: necklace5, description: 'An intricately hand-set kundan choker for festive and bridal wear.', rating: 4.6, reviews: 76, stock: 7 },
  { id: 'n06', name: 'Classic Pearl Strand Necklace', category: 'Necklaces', price: 18999, originalPrice: 20999, material: 'Freshwater Pearl', image: necklace6, description: 'A single strand of lustrous freshwater pearls, classic and versatile.', rating: 4.7, reviews: 91, stock: 16 },
  { id: 'n07', name: 'Rose Gold Delicate Necklace', category: 'Necklaces', price: 9999, originalPrice: 11499, material: '18k Rose Gold', image: necklace7, description: 'A fine rose-gold chain with a small geometric pendant.', rating: 4.5, reviews: 58, stock: 30 },
  { id: 'n08', name: 'Emerald Statement Necklace', category: 'Necklaces', price: 58999, originalPrice: 64999, material: '18k Gold · Emerald', image: necklace8, description: 'A bold emerald-and-gold necklace built for evening statement wear.', rating: 4.8, reviews: 41, stock: 5 },
  { id: 'n09', name: 'Silver Minimalist Necklace', category: 'Necklaces', price: 3499, originalPrice: 3999, material: '925 Sterling Silver', image: necklace9, description: 'A slim silver chain with a tiny charm — everyday minimal wear.', rating: 4.4, reviews: 187, stock: 45 },
  { id: 'n10', name: 'Antique Temple Necklace', category: 'Necklaces', price: 41999, originalPrice: 46999, material: '22k Gold', image: necklace10, description: 'An antique-finish necklace featuring traditional temple deity motifs.', rating: 4.7, reviews: 55, stock: 8 },

  // ==================== EARRINGS ====================
  { id: 'e01', name: 'Kanni Ruby Drop Earrings', category: 'Earrings', price: 28499, originalPrice: 33499, material: '22k Gold · Ruby', image: earrings1, description: 'Handcrafted yellow gold earrings with vivid teardrop rubies in filigree borders.', rating: 4.8, reviews: 66, stock: 10 },
  { id: 'e02', name: 'Arasi South Sea Pearl Studs', category: 'Earrings', price: 14999, originalPrice: 14999, material: '18k White Gold · Pearl', image: earrings2, description: 'Lustrous freshwater pearls mounted on hypoallergenic white-gold posts.', rating: 4.9, reviews: 84, stock: 20 },
  { id: 'e03', name: 'Gold Jhumka Earrings', category: 'Earrings', price: 12999, originalPrice: 14999, material: '22k Gold', image: earrings3, description: 'Classic bell-shaped jhumkas with fine gold filigree work.', rating: 4.7, reviews: 143, stock: 20 },
  { id: 'e04', name: 'Diamond Stud Earrings', category: 'Earrings', price: 19999, originalPrice: 22999, material: '18k White Gold · Diamond', image: earrings4, description: 'Timeless round-cut diamond studs for everyday elegance.', rating: 4.8, reviews: 201, stock: 25 },
  { id: 'e05', name: 'Pearl Drop Earrings', category: 'Earrings', price: 6999, originalPrice: 7999, material: '14k Gold · Pearl', image: earrings5, description: 'Soft pearl drops on delicate gold hooks.', rating: 4.6, reviews: 87, stock: 33 },
  { id: 'e06', name: 'Silver Hoop Earrings', category: 'Earrings', price: 1999, originalPrice: 2499, material: '925 Sterling Silver', image: earrings6, description: 'Classic medium-sized silver hoops for daily wear.', rating: 4.4, reviews: 165, stock: 50 },
  { id: 'e07', name: 'Kundan Chandbali Earrings', category: 'Earrings', price: 9999, originalPrice: 11999, material: 'Gold-Plated Brass · Kundan', image: earrings7, description: 'Crescent-shaped chandbali earrings with hand-set kundan stones.', rating: 4.6, reviews: 52, stock: 15 },
  { id: 'e08', name: 'Emerald Drop Earrings', category: 'Earrings', price: 27999, originalPrice: 31999, material: '18k Gold · Emerald', image: earrings8, description: 'Emerald drops framed in gold for a rich pop of colour.', rating: 4.7, reviews: 34, stock: 9 },
  { id: 'e09', name: 'Traditional Gold Danglers', category: 'Earrings', price: 15999, originalPrice: 17999, material: '22k Gold', image: earrings9, description: 'Long, intricately worked gold danglers for festive occasions.', rating: 4.6, reviews: 61, stock: 17 },
  { id: 'e10', name: 'Bridal Polki Earrings', category: 'Earrings', price: 38999, originalPrice: 42999, material: '22k Gold · Polki', image: earrings10, description: 'Statement polki earrings designed to match bridal necklace sets.', rating: 4.9, reviews: 45, stock: 6 },

  // ==================== BANGLES ====================
  { id: 'ba01', name: 'Thangam Hand-Hammered Gold Bangles', category: 'Bangles', price: 65999, originalPrice: 74999, material: '22k Gold · Set of 2', image: bangles1, description: 'Royal gold bangles with delicate hand-engraved floral motifs.', rating: 5.0, reviews: 41, stock: 6 },
  { id: 'ba02', name: 'Diamond Studded Bangle', category: 'Bangles', price: 79999, originalPrice: 86999, material: '18k Gold · Diamond', image: bangles2, description: 'A gold bangle inset with a row of sparkling diamonds.', rating: 4.8, reviews: 29, stock: 4 },
  { id: 'ba03', name: 'Silver Oxidized Bangle', category: 'Bangles', price: 3499, originalPrice: 3999, material: '925 Sterling Silver', image: bangles3, description: 'An oxidized-finish bangle with traditional carved patterns.', rating: 4.4, reviews: 82, stock: 30 },
  { id: 'ba05', name: 'Rose Gold Slim Bangle', category: 'Bangles', price: 13999, originalPrice: 15499, material: '18k Rose Gold', image: bangles5, description: 'A slim, smooth rose-gold bangle for everyday stacking.', rating: 4.5, reviews: 44, stock: 16 },
  { id: 'ba06', name: 'Kundan Bridal Bangle', category: 'Bangles', price: 54999, originalPrice: 59999, material: '22k Gold · Kundan', image: bangles6, description: 'An ornate kundan-studded bangle made for bridal sets.', rating: 4.8, reviews: 21, stock: 5 },
  { id: 'ba07', name: 'Everyday Gold Bangle', category: 'Bangles', price: 23999, originalPrice: 23999, material: '18k Gold', image: bangles7, description: 'A lightweight, comfortable gold bangle for daily wear.', rating: 4.5, reviews: 58, stock: 20 },
  { id: 'ba08', name: 'Lakshmi Gold Bangles', category: 'Bangles', price: 45999, originalPrice: 49999, material: '22k Yellow Gold', image: bangles8, description: 'Elegant traditional gold bangles with detailed floral craftsmanship.', rating: 4.8, reviews: 126, stock: 12 },
  { id: 'ba09', name: 'Traditional Gold Bangle', category: 'Bangles', price: 42999, originalPrice: 46999, material: '22k Gold', image: bangles9, description: 'A classic solid gold bangle with fine engraved detailing.', rating: 4.7, reviews: 66, stock: 10 },
  { id: 'ba10', name: 'Silver Beaded Bangle', category: 'Bangles', price: 4499, originalPrice: 4999, material: '925 Sterling Silver', image: bangles10, description: 'A delicate beaded silver bangle for casual everyday wear.', rating: 4.3, reviews: 37, stock: 26 },

  // ==================== BRACELETS ====================
  { id: 'br01', name: 'Vairam Diamond Line Tennis Bracelet', category: 'Bracelets', price: 89999, originalPrice: 112499, material: 'Platinum · Diamond', image: bracelts1, description: 'A seamless row of round brilliant cut diamonds claw-set in platinum.', rating: 5.0, reviews: 57, stock: 3 },
  { id: 'br02', name: 'Gold Cuban Link Bracelet', category: 'Bracelets', price: 21999, originalPrice: 24999, material: '18k Gold', image: bracelts2, description: 'A bold cuban-link chain bracelet with a secure clasp.', rating: 4.6, reviews: 68, stock: 14 },
  { id: 'br03', name: 'Silver Charm Bracelet', category: 'Bracelets', price: 2999, originalPrice: 3499, material: '925 Sterling Silver', image: bracelts3, description: 'A playful charm bracelet with three interchangeable charms.', rating: 4.4, reviews: 121, stock: 35 },
  { id: 'br04', name: 'Rose Gold Bangle-Style Bracelet', category: 'Bracelets', price: 8999, originalPrice: 9999, material: '18k Rose Gold', image: bracelts4, description: 'A rigid open-cuff bracelet with a smooth rose-gold finish.', rating: 4.5, reviews: 49, stock: 22 },
  { id: 'br05', name: 'Pearl Beaded Bracelet', category: 'Bracelets', price: 3999, originalPrice: 4499, material: 'Freshwater Pearl', image: bracelts5, description: 'Hand-strung freshwater pearls on a stretch cord.', rating: 4.5, reviews: 73, stock: 27 },
  { id: 'br06', name: 'Traditional Gold Kada Bracelet', category: 'Bracelets', price: 33999, originalPrice: 37999, material: '22k Gold', image: bracelts6, description: 'A sturdy, engraved kada-style bracelet rooted in traditional design.', rating: 4.7, reviews: 38, stock: 8 },
  { id: 'br07', name: 'Gemstone Chain Bracelet', category: 'Bracelets', price: 11999, originalPrice: 13499, material: '18k Gold · Mixed Gemstone', image: bracelts7, description: 'Small coloured gemstones set along a fine gold chain.', rating: 4.4, reviews: 31, stock: 19 },
  { id: 'br08', name: 'Minimalist Chain Bracelet', category: 'Bracelets', price: 1799, originalPrice: 1999, material: '925 Sterling Silver', image: bracelts8, description: 'A thin everyday chain bracelet with an adjustable clasp.', rating: 4.3, reviews: 94, stock: 48 },
  { id: 'br09', name: 'Diamond Halo Tennis Bracelet', category: 'Bracelets', price: 68999, originalPrice: 74999, material: '18k White Gold · Diamond', image: bracelts9, description: 'A continuous line of brilliant-cut diamonds in a classic tennis setting.', rating: 4.9, reviews: 40, stock: 5 },
  { id: 'br10', name: 'Traditional Gold Chain Bracelet', category: 'Bracelets', price: 17999, originalPrice: 19999, material: '22k Gold', image: bracelts10, description: 'A substantial gold chain bracelet with traditional detailing.', rating: 4.6, reviews: 52, stock: 14 },

  // ==================== PENDANTS ====================
  { id: 'p01', name: 'Ganesha Divine Gold Pendant', category: 'Pendants', price: 21999, originalPrice: 23999, material: '22k Gold · Ruby Accent', image: pendents0, description: 'An intricately molded Lord Ganesha pendant with ruby eye accents.', rating: 4.9, reviews: 60, stock: 12 },
  { id: 'p02', name: 'Diamond Solitaire Pendant', category: 'Pendants', price: 28999, originalPrice: 32999, material: '18k White Gold · Diamond', image: pendents1, description: 'A single diamond pendant designed to pair with any chain.', rating: 4.8, reviews: 92, stock: 18 },
  { id: 'p03', name: 'Emerald Halo Pendant', category: 'Pendants', price: 19999, originalPrice: 22999, material: '18k Gold · Emerald', image: pendents3, description: 'An emerald centre stone ringed by a delicate diamond halo.', rating: 4.6, reviews: 37, stock: 12 },
  { id: 'p04', name: 'Pearl Drop Pendant', category: 'Pendants', price: 4999, originalPrice: 5499, material: '14k Gold · Pearl', image: pendents4, description: 'A single lustrous pearl suspended on a simple gold bail.', rating: 4.5, reviews: 65, stock: 31 },
  { id: 'p05', name: 'Traditional Temple Pendant', category: 'Pendants', price: 12999, originalPrice: 14499, material: '22k Gold', image: pendents5, description: 'A temple-style pendant featuring traditional deity carving.', rating: 4.7, reviews: 48, stock: 14 },
  { id: 'p06', name: 'Rose Gold Heart Pendant', category: 'Pendants', price: 5999, originalPrice: 6499, material: '18k Rose Gold', image: pendents6, description: 'A softly curved heart pendant in warm rose gold.', rating: 4.4, reviews: 89, stock: 34 },
  { id: 'p07', name: 'Gold Om Pendant', category: 'Pendants', price: 6999, originalPrice: 7999, material: '22k Gold', image: pendents7, description: 'A finely detailed Om symbol pendant in solid gold.', rating: 4.6, reviews: 104, stock: 26 },
  { id: 'p08', name: 'Sapphire Drop Pendant', category: 'Pendants', price: 24999, originalPrice: 27999, material: '18k Gold · Sapphire', image: pendents8, description: 'A rich blue sapphire drop set in warm 18k gold.', rating: 4.7, reviews: 33, stock: 11 },
  { id: 'p09', name: 'Silver Minimalist Pendant', category: 'Pendants', price: 2999, originalPrice: 3299, material: '925 Sterling Silver', image: pendents9, description: 'A tiny geometric pendant on a fine silver chain.', rating: 4.3, reviews: 76, stock: 40 },
  { id: 'p10', name: 'Kundan Bridal Pendant', category: 'Pendants', price: 17999, originalPrice: 19999, material: 'Gold-Plated Brass · Kundan', image: pendents10, description: 'An ornate kundan pendant designed to match bridal necklace sets.', rating: 4.6, reviews: 28, stock: 9 },
];

export default products;
