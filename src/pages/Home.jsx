import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Gem } from 'lucide-react';

import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/SkeletonLoader';
import Toast from '../components/Toast';
import api from '../services/api';

// ============================================================
// LOCAL BRACELET IMAGE
// Make sure this file exists:
// src/assets/bracelets.jpg
// ============================================================
import braceletImage from '../assets/bracelets.jpg';

// ============================================================
// CATEGORY DATA
// ============================================================
const categories = [
  {
    name: 'Rings',
    image:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    desc: 'Solitaires & Pavé Bands',
  },

  {
    name: 'Necklaces',
    image:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    desc: 'Chokers & Pendant Chains',
  },

  {
    name: 'Earrings',
    image:
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    desc: 'Ruby Drops & Pearl Studs',
  },

  {
    name: 'Bracelets',
    image: braceletImage,
    desc: 'Diamond Tennis Lines',
  },

  {
    name: 'Bangles',
    image:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    desc: 'Hand-Engraved 22k Gold',
  },

  {
    name: 'Pendants',
    image:
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80',
    desc: 'Divine Temple Artistry',
  },
];

// ============================================================
// FALLBACK IMAGE
// ============================================================
const fallbackImage =
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80';

// ============================================================
// HOME COMPONENT
// ============================================================
export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // ==========================================================
  // GET FEATURED PRODUCTS
  // ==========================================================
  useEffect(() => {
    api
      .get('/products?featured=true')
      .then((res) => {
        setFeaturedProducts(res.data || []);
      })
      .catch((error) => {
        console.warn('Failed to fetch featured products:', error);
        setFeaturedProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ==========================================================
  // IMAGE ERROR HANDLER
  // ==========================================================
  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackImage;
  };

  return (
    <div className="min-h-screen text-ivory">

      {/* ======================================================
          TOAST
      ======================================================= */}
      <Toast
        message={toastMsg}
        onClose={() => setToastMsg('')}
      />

      {/* ======================================================
          HERO SECTION
      ======================================================= */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-ink via-amber-950/20 to-ink">

        {/* Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,200,126,0.15)_0,transparent_70%)] pointer-events-none" />

        {/* Hero Content */}
        <div className="max-w-5xl mx-auto px-4 py-20 text-center relative z-10 space-y-6">

          {/* Collection Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold uppercase tracking-widest animate-pulse">
            <Sparkles className="w-4 h-4 text-gold" />
            The Royal Solitaire Collection 2026
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-ivory tracking-wide leading-tight">
            Timeless Luxury,
            <br />

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-200 to-amber-500">
              Artisanal Brilliance.
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-ivory/70 font-light leading-relaxed">
            Discover handcrafted 22k pure gold heirlooms, Zambian emerald
            halos, and certified natural diamond solitaires designed to be
            treasured for generations.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">

            {/* Explore Catalog */}
            <Link
              to="/shop"
              className="px-8 py-3.5 bg-gradient-to-r from-gold to-amber-600 hover:from-amber-500 hover:to-gold text-ink font-serif font-bold text-base rounded-full shadow-2xl hover:shadow-gold/20 transition-all flex items-center gap-2"
            >
              Explore Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* View Solitaires */}
            <Link
              to="/shop?category=Rings"
              className="px-8 py-3.5 bg-ink/80 border border-gold/40 hover:bg-gold/10 text-gold font-serif font-semibold text-base rounded-full transition-all"
            >
              View Solitaires
            </Link>

          </div>
        </div>
      </section>

      {/* ======================================================
          CATEGORY SECTION
      ======================================================= */}
      <section className="max-w-7xl mx-auto px-4 py-16">

        {/* Section Heading */}
        <div className="text-center mb-12">

          <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-1">
            Curated Collections
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif text-ivory">
            Explore by Category
          </h2>

        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-28 rounded-2xl overflow-hidden border border-gold/20 hover:border-gold transition-all shadow-lg"
            >

              {/* Category Image */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75"
                onError={handleImageError}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent flex flex-col justify-end p-4 text-center">

                {/* Category Name */}
                <h3 className="font-serif font-bold text-lg text-gold group-hover:text-white transition-colors">
                  {cat.name}
                </h3>

                {/* Category Description */}
                <p className="text-[10px] text-ivory/70 line-clamp-1">
                  {cat.desc}
                </p>

              </div>
            </Link>
          ))}

        </div>
      </section>

      {/* ======================================================
          FEATURED PRODUCTS
      ======================================================= */}
      <section className="max-w-7xl mx-auto px-4 py-16">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 pb-4 border-b border-gold/20">

          <div>

            <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-1">
              Masterpiece Gallery
            </span>

            <h2 className="text-3xl font-serif text-ivory">
              Signature Pieces
            </h2>

          </div>

          {/* Catalog Link */}
          <Link
            to="/shop"
            className="text-xs font-semibold text-gold hover:underline flex items-center gap-1 mt-2 sm:mt-0"
          >
            View Full Catalog ({featuredProducts.length}+)
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

        </div>

        {/* ====================================================
            LOADING STATE
        ===================================================== */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {[...Array(4)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}

          </div>
        )}

        {/* ====================================================
            EMPTY STATE
        ===================================================== */}
        {!loading && featuredProducts.length === 0 && (
          <div className="text-center py-16 border border-gold/20 rounded-2xl">

            <Gem className="w-10 h-10 text-gold mx-auto mb-4" />

            <h3 className="text-xl font-serif text-ivory mb-2">
              No Featured Products
            </h3>

            <p className="text-sm text-ivory/50">
              Please check back soon for our latest collection.
            </p>

          </div>
        )}

        {/* ====================================================
            PRODUCT GRID
        ===================================================== */}
        {!loading && featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToast={(message) => setToastMsg(message)}
              />
            ))}

          </div>
        )}

      </section>

      {/* ======================================================
          CRAFTSMANSHIP & GUARANTEE SECTION
      ======================================================= */}
      <section className="bg-gradient-to-r from-amber-950/40 via-ink to-amber-950/40 border-y border-gold/20 py-16">

        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">

          {/* Gem Icon */}
          <Gem className="w-12 h-12 text-gold mx-auto" />

          {/* Heading */}
          <h2 className="text-3xl font-serif text-gold">
            The Neela Standard of Excellence
          </h2>

          {/* Description */}
          <p className="text-sm text-ivory/70 leading-relaxed max-w-2xl mx-auto font-light">
            Every creation bearing the Neela insignia undergoes rigorous
            14-point gemological quality control, precision 3D CAD molding,
            and laser BIS hallmark verification.
          </p>

          {/* Guarantees */}
          <div className="flex flex-wrap justify-center gap-8 text-xs font-semibold text-gold pt-2">

            {/* Certified */}
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              100% Certified
            </span>

            {/* Delivery */}
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Insured Delivery
            </span>

            {/* Buyback */}
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Lifetime Buyback
            </span>

          </div>
        </div>
      </section>

    </div>
  );
}
