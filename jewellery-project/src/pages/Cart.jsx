import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

function formatPrice(n) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function Cart() {
  const { items, increment, decrement, removeFromCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-40 pb-24 text-center">
        <h1 className="font-display text-3xl text-ivory mb-4">Your bag is empty</h1>
        <p className="text-ivory/60 mb-8">Nothing added yet.</p>
        <Link
          to="/shop"
          className="bg-gold text-ink px-6 py-3 text-sm uppercase tracking-widest hover:bg-goldbright transition-colors"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
      <h1 className="font-display text-4xl text-ivory mb-10">Your Bag</h1>

      <div className="divide-y divide-white/10 border-y border-white/10">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-6 py-6">
            <span
              className="block rounded-full flex-shrink-0"
              style={{ width: 48, height: 48, background: item.swatch }}
            />
            <div className="flex-1">
              <h3 className="font-display text-xl text-ivory">{item.name}</h3>
              <p className="font-mono-brand text-xs text-ivory/50">{item.material}</p>
            </div>
            <div className="flex items-center gap-3 border border-white/20 px-3 py-1">
              <button onClick={() => decrement(item.id)} aria-label="Decrease quantity" className="text-ivory/70 hover:text-gold">
                <FiMinus size={14} />
              </button>
              <span className="font-mono-brand w-4 text-center">{item.qty}</span>
              <button onClick={() => increment(item.id)} aria-label="Increase quantity" className="text-ivory/70 hover:text-gold">
                <FiPlus size={14} />
              </button>
            </div>
            <span className="font-mono-brand text-gold w-24 text-right">
              {formatPrice(item.price * item.qty)}
            </span>
            <button
              onClick={() => removeFromCart(item.id)}
              aria-label={`Remove ${item.name}`}
              className="text-ivory/40 hover:text-rosewood"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <span className="text-ivory/60">Subtotal</span>
        <span className="font-mono-brand text-2xl text-gold">{formatPrice(total)}</span>
      </div>
      <p className="text-ivory/40 text-xs mt-1">Taxes and shipping calculated at checkout.</p>

      <button
        onClick={() => alert('Checkout is not wired up yet — connect a payment provider here.')}
        className="mt-8 w-full bg-gold text-ink py-4 text-sm uppercase tracking-widest hover:bg-goldbright transition-colors"
      >
        Checkout
      </button>
    </div>
  );
}
