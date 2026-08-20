import React from 'react';
import Pendant from '../components/Pendant';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
      <Pendant className="w-16 mb-8" animate={false} />
      <h1 className="font-display text-4xl text-ivory mb-6">Our story</h1>
      <div className="text-ivory/70 leading-relaxed space-y-5 max-w-2xl">
        <p>
          Neela Jewellery was born from a simple belief — that fine jewellery is never just an accessory. It is a memory worn close to the skin. A grandmother's blessing passed down through generations. A promise made and kept. We exist to craft those moments into something tangible, timeless, and deeply personal.
        </p>
        <p>
         Every piece in our collection is thoughtfully designed with attention to purity, weight, and finish. From delicate everyday rings to statement necklaces crafted for life's most significant occasions, we hold each creation to the same uncompromising standard — because the person wearing it deserves nothing less.
        </p>
        <p>
         We believe luxury should feel honest. That's why every order comes with complete transparency — real gold weight, material specifications, GST-inclusive pricing, and a verified tax invoice. No hidden costs. No ambiguity. Just jewellery you can trust, delivered with care. 
Neela Jewellery — Crafted with intention. Worn with love.
        </p>
      </div>
    </div>
  );
}
