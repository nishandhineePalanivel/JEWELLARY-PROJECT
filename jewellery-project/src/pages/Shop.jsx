import React, { useMemo, useState } from 'react';
import products, { categories } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [active, setActive] = useState('All');

  const filtered = useMemo(
    () => (active === 'All' ? products : products.filter((p) => p.category === active)),
    [active]
  );

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">
      <h1 className="font-display text-4xl text-ivory mb-2">Shop</h1>
      <p className="text-ivory/60 mb-8">{filtered.length} pieces</p>

      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
              active === c
                ? 'bg-gold text-ink border-gold'
                : 'border-white/20 text-ivory/70 hover:border-gold hover:text-gold'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
