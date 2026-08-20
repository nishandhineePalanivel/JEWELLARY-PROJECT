import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Gem } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/SkeletonLoader';
import Toast from '../components/Toast';
import api from '../services/api';

const categories = [
  { 
    name: 'Rings', 
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80', 
    desc: 'Solitaires & Pavé Bands' 
  },
  { 
    name: 'Necklaces', 
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80', 
    desc: 'Chokers & Pendant Chains' 
  },
  { 
    name: 'Earrings', 
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80', 
    desc: 'Ruby Drops & Pearl Studs' 
  },
  { 
    name: 'Bracelets', 
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400&q=80', 
    desc: 'Diamond Tennis Lines' 
  },
  { 
    name: 'Bangles', 
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80', 
    desc: 'Hand-Engraved 22k Gold' 
  },
  { 
    name: 'Pendants', 
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&q=80', 
    desc: 'Divine Temple Artistry' 
  },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    api.get('/products?featured=true')
      .then(res => setFeaturedProducts(res.data))
      .catch(e => console.warn('Failed to fetch featured products'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen text-ivory">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-ink via-amber-950/20 to-ink">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,200,126,0.15)_0,transparent_70%)] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-4 py-20 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold uppercase tracking-widest animate-pulse">
            <Sparkles className="w-4 h-4 text-gold" />
            The Royal Solitaire Collection 2026
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-ivory tracking-wide leading-tight">
            Timeless Luxury, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-200 to-amber-500">
              Artisanal Brilliance.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-ivory/70 font-light leading-relaxed">
            Discover handcrafted 22k pure gold heirlooms, Zambian emerald halos, and certified natural diamond solitaires designed to be treasured for generations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/shop"
              className="px-8 py-3.5 bg-gradient-to-r from-gold to-amber-600 hover:from-amber-500 hover:to-gold text-ink font-serif font-bold text-base rounded-full shadow-2xl hover:shadow-gold/20 transition-all flex items-center gap-2"
            >
              Explore Catalog <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/shop?category=Rings"
              className="px-8 py-3.5 bg-ink/80 border border-gold/40 hover:bg-gold/10 text-gold font-serif font-semibold text-base rounded-full transition-all"
            >
              View Solitaires
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-1">Curated Collections</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-ivory">Explore by Category</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${cat.name}`}
              className="group relative h-28 rounded-2xl overflow-hidden border border-gold/20 hover:border-gold transition-all shadow-lg"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent flex flex-col justify-end p-4 text-center">
                <h3 className="font-serif font-bold text-lg text-gold group-hover:text-white transition-colors">{cat.name}</h3>
                <p className="text-[10px] text-ivory/70 line-clamp-1">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 pb-4 border-b border-gold/20">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-1">Masterpiece Gallery</span>
            <h2 className="text-3xl font-serif text-ivory">Signature Pieces</h2>
          </div>
          <Link to="/shop" className="text-xs font-semibold text-gold hover:underline flex items-center gap-1 mt-2 sm:mt-0">
            View Full Catalog ({featuredProducts.length}+) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToast={(msg) => setToastMsg(msg)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Craftsmanship & Guarantee Banner */}
      <section className="bg-gradient-to-r from-amber-950/40 via-ink to-amber-950/40 border-y border-gold/20 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <Gem className="w-12 h-12 text-gold mx-auto" />
          <h2 className="text-3xl font-serif text-gold">The Neela Standard of Excellence</h2>
          <p className="text-sm text-ivory/70 leading-relaxed max-w-2xl mx-auto font-light">
            Every creation bearing the Neela insignia undergoes rigorous 14-point gemological quality control, precision 3D CAD molding, and laser BIS hallmark verification.
          </p>
          <div className="flex justify-center gap-8 text-xs font-semibold text-gold pt-2">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> 100% Certified</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Insured Delivery</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Lifetime Buyback</span>
          </div>
        </div>
      </section>
    </div>
  );
}
