import React from 'react';
import Pendant from './Pendant';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Pendant className="w-8 h-12 mb-4" animate={false} />
          <p className="font-display text-2xl text-ivory mb-2">Anaya Jewels</p>
          <p className="text-ivory/60 text-sm max-w-xs">
            Fine jewellery made in small batches. Every piece is hallmarked and
            comes with a certificate of materials.
          </p>
        </div>
        <div>
          <p className="uppercase text-xs tracking-widest text-gold mb-4">Shop</p>
          <ul className="space-y-2 text-ivory/70 text-sm">
            <li>Rings</li>
            <li>Necklaces</li>
            <li>Earrings</li>
            <li>Bracelets</li>
          </ul>
        </div>
        <div>
          <p className="uppercase text-xs tracking-widest text-gold mb-4">Studio</p>
          <ul className="space-y-2 text-ivory/70 text-sm">
            <li>hello@anayajewels.example</li>
            <li>Mon – Sat, 10am – 7pm</li>
            <li>Coimbatore, Tamil Nadu</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-ivory/40 pb-8 font-mono-brand">
        © {new Date().getFullYear()} Anaya Jewels. All rights reserved.
      </div>
    </footer>
  );
}
