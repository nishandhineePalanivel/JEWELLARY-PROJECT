import React from 'react';
import Pendant from '../components/Pendant';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
      <Pendant className="w-16 mb-8" animate={false} />
      <h1 className="font-display text-4xl text-ivory mb-6">Our story</h1>
      <div className="text-ivory/70 leading-relaxed space-y-5 max-w-2xl">
        <p>
          Anaya Jewels started as a two-person workshop making custom pieces for
          family weddings. Every design still passes through the same hands
          before it reaches a case: cast, set, polished and hallmarked in-house.
        </p>
        <p>
          We work mostly in 18k and 22k gold, keeping batches small so each
          piece gets checked individually rather than rushed through a line.
          It means some designs sell out — we'd rather that than lower the bar.
        </p>
        <p>
          If you're ordering for an occasion with a date attached, write to us
          before you order. We'll tell you honestly if we can make it in time.
        </p>
      </div>
    </div>
  );
}
