import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function formatPrice(n) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="group border border-white/10 hover:border-gold/60 transition-colors duration-300">
      <Link to={`/product/${product.id}`} className="block">
        <div
          className="h-56 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${product.swatch}33, #14110F 70%)`,
          }}
        >
          <span
            className="block rounded-full"
            style={{
              width: 64,
              height: 64,
              background: product.swatch,
              boxShadow: `0 0 40px ${product.swatch}55`,
            }}
          />
        </div>
      </Link>
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-gold/80">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-xl text-ivory mt-1 hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="font-mono-brand text-xs text-ivory/50 mt-1">{product.material}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-mono-brand text-gold">{formatPrice(product.price)}</span>
          <button
            onClick={() => addToCart(product)}
            className="text-xs uppercase tracking-widest border border-gold/60 text-gold px-3 py-2 hover:bg-gold hover:text-ink transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
