import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import products from '../data/products';
import { useCart } from '../context/CartContext';

function formatPrice(n) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === id);

  if (!product) return <Navigate to="/shop" replace />;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">
      <Link to="/shop" className="text-gold text-sm uppercase tracking-widest">
        ← Back to shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        <div
          className="h-96 flex items-center justify-center border border-white/10"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${product.swatch}33, #14110F 70%)`,
          }}
        >
          <span
            className="block rounded-full"
            style={{
              width: 120,
              height: 120,
              background: product.swatch,
              boxShadow: `0 0 60px ${product.swatch}55`,
            }}
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-gold/80">{product.category}</p>
          <h1 className="font-display text-4xl text-ivory mt-2">{product.name}</h1>
          <p className="font-mono-brand text-sm text-ivory/50 mt-2">{product.material}</p>
          <p className="font-mono-brand text-2xl text-gold mt-6">{formatPrice(product.price)}</p>
          <p className="text-ivory/70 mt-6 leading-relaxed">{product.description}</p>

          <button
            onClick={() => addToCart(product)}
            className="mt-8 bg-gold text-ink px-8 py-3 text-sm uppercase tracking-widest hover:bg-goldbright transition-colors"
          >
            Add to bag
          </button>

          <dl className="mt-10 border-t border-white/10 pt-6 grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-ivory/50">Material</dt>
            <dd className="text-ivory/80">{product.material}</dd>
            <dt className="text-ivory/50">Hallmark</dt>
            <dd className="text-ivory/80">BIS certified</dd>
            <dt className="text-ivory/50">Delivery</dt>
            <dd className="text-ivory/80">5–7 business days</dd>
            <dt className="text-ivory/50">Returns</dt>
            <dd className="text-ivory/80">7 days, unworn</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
