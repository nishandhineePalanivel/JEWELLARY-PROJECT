import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, RefreshCw, Truck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink border-t border-gold/20 text-ivory/70 text-xs">
      {/* Value Proposition Highlights */}
      <div className="border-b border-gold/10 py-8 bg-ink/60">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/30">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-semibold text-gold text-sm">BIS 100% Hallmarked</h4>
            <p className="text-[11px] text-ivory/50">Certified 22k & 18k pure gold with laser hallmark stamp.</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/30">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-semibold text-gold text-sm">Insured Shipping</h4>
            <p className="text-[11px] text-ivory/50">Full transit insurance on all precious shipments across India.</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/30">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-semibold text-gold text-sm">Lifetime Exchange</h4>
            <p className="text-[11px] text-ivory/50">Transparent buyback and exchange policy on prevailing market rates.</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-semibold text-gold text-sm">Conflict-Free Stones</h4>
            <p className="text-[11px] text-ivory/50">Ethically sourced natural diamonds and certified gemstones.</p>
          </div>
        </div>
      </div>

      {/* Main Links Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold text-ink font-serif font-bold flex items-center justify-center text-base">N</div>
            <span className="font-serif text-xl font-bold text-gold tracking-widest">NEELA</span>
          </div>
          <p className="text-ivory/60 leading-relaxed text-[11px]">
            Embodying timeless royal heritage and contemporary elegance. Crafting certified diamond solitaires, temple gold collections, and bespoke heirlooms.
          </p>
        </div>

        <div>
          <h4 className="font-serif font-semibold text-gold uppercase tracking-wider mb-3">Fine Collections</h4>
          <ul className="space-y-2 text-[11px]">
            <li><Link to="/shop?category=Rings" className="hover:text-gold transition-colors">Solitaire Rings</Link></li>
            <li><Link to="/shop?category=Necklaces" className="hover:text-gold transition-colors">Bridal Necklaces</Link></li>
            <li><Link to="/shop?category=Earrings" className="hover:text-gold transition-colors">Ruby & Emerald Studs</Link></li>
            <li><Link to="/shop?category=Bangles" className="hover:text-gold transition-colors">Royal Gold Bangles</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif font-semibold text-gold uppercase tracking-wider mb-3">Customer Care</h4>
          <ul className="space-y-2 text-[11px]">
            <li><Link to="/orders" className="hover:text-gold transition-colors">Order Tracking</Link></li>
            <li><Link to="/about" className="hover:text-gold transition-colors">Certificate & Purity</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Schedule Private Appointment</Link></li>
            <li><Link to="/cart" className="hover:text-gold transition-colors">Shopping Bag</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif font-semibold text-gold uppercase tracking-wider mb-3">Flagship Boutique</h4>
          <p className="text-[11px] text-ivory/60 leading-relaxed">
            100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038<br />
            Email: care@neelajewellery.com<br />
            Phone: +91 (800) 555-NEELA
          </p>
        </div>
      </div>

      <div className="border-t border-gold/10 py-4 text-center text-[10px] text-ivory/40">
        © {new Date().getFullYear()} Neela Jewellery Pvt. Ltd. All rights reserved. Built with React & Node.js.
      </div>
    </footer>
  );
}
