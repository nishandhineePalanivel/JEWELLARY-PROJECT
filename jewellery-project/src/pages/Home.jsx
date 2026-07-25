import React from 'react';
import { Link } from 'react-router-dom';
import products from '../data/products';
import ProductCard from '../components/ProductCard';
import Pendant from '../components/Pendant';

export default function Home() {
  const featured = products.slice(0, 3);

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 pt-40 pb-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="uppercase tracking-[0.3em] text-gold text-xs mb-6">
            Small-batch fine jewellery
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-tight text-ivory">
            Pieces made to be
            <span className="italic text-gold"> worn every day,</span>
            not saved for one.
          </h1>
          <p className="text-ivory/60 mt-6 max-w-md">
            Anaya Jewels designs rings, chains and earrings in 18k and 22k gold,
            each one hallmarked and finished by hand in Coimbatore.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              to="/shop"
              className="bg-gold text-ink px-6 py-3 text-sm uppercase tracking-widest hover:bg-goldbright transition-colors"
            >
              Shop the collection
            </Link>
            <Link
              to="/about"
              className="border border-ivory/30 text-ivory px-6 py-3 text-sm uppercase tracking-widest hover:border-gold hover:text-gold transition-colors"
            >
              Our story
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          <Pendant className="w-40 md:w-56 drop-shadow-[0_0_25px_rgba(198,161,91,0.25)]" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl text-ivory">Featured</h2>
          <Link to="/shop" className="text-gold text-sm uppercase tracking-widest hover:text-goldbright">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-emerald/20">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <p className="font-display text-2xl text-gold mb-2">Hallmarked</p>
            <p className="text-ivory/60 text-sm">Every piece is BIS hallmarked and certified.</p>
          </div>
          <div>
            <p className="font-display text-2xl text-gold mb-2">Made to order</p>
            <p className="text-ivory/60 text-sm">Small batches, cast and finished by hand.</p>
          </div>
          <div>
            <p className="font-display text-2xl text-gold mb-2">7-day returns</p>
            <p className="text-ivory/60 text-sm">Full refund if it's not the right fit.</p>
          </div>
        </div>
      </section>
    </>
  );
}
