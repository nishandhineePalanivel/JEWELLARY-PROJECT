import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center max-w-md mx-auto px-4 py-20 text-center text-ivory space-y-6">
      <div className="w-24 h-24 bg-gold/10 border border-gold/40 rounded-full flex items-center justify-center mx-auto text-gold font-serif text-3xl font-bold shadow-2xl">
        404
      </div>
      <h1 className="text-3xl font-serif font-bold text-gold">Page Not Found</h1>
      <p className="text-xs text-ivory/60 leading-relaxed">
        The luxury page or collection you are looking for has been moved or does not exist.
      </p>
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gold to-amber-600 text-ink font-bold text-xs rounded-xl shadow-xl hover:scale-105 transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Collections
      </Link>
    </div>
  );
}
