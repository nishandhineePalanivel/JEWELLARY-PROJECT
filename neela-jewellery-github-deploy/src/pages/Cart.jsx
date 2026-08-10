import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { items, increment, decrement, removeFromCart, clearCart, subtotal, discount, gst, shipping, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-20 text-center text-ivory space-y-6">
        <div className="w-20 h-20 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto text-gold">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-serif text-gold font-bold">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-ivory/60 max-w-md mx-auto">
          Explore our hand-crafted gold solitaires, emerald halos, and royal ruby drop collections to add your favourite heirlooms.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gold to-amber-600 text-ink font-bold text-sm rounded-xl shadow-xl hover:scale-105 transition-all"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-10 text-ivory">
      <div className="flex justify-between items-center mb-8 border-b border-gold/20 pb-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gold">Shopping Bag</h1>
          <p className="text-xs text-ivory/60 mt-1">{items.length} item(s) selected for checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const discPct = Number(item.discount_percent || 0);
            const unitPrice = Number(item.price);
            const finalUnitPrice = discPct > 0 ? Math.round(unitPrice * (1 - discPct / 100)) : unitPrice;
            const itemTotal = finalUnitPrice * item.qty;
            const imgUrl = item.images?.[0]?.image_url || item.images?.[0] || item.image_url;

            return (
              <div
                key={item.id}
                className="bg-ink/80 border border-gold/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-lg"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-ink border border-gold/20 flex-shrink-0 flex items-center justify-center">
                    {imgUrl ? (
                      <img src={imgUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gold font-serif text-xl font-bold">{item.category?.charAt(0) || 'NJ'}</div>
                    )}
                  </div>

                  <div>
                    <Link to={`/product/${item.id}`} className="font-serif text-base font-semibold text-ivory hover:text-gold transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <span className="text-xs text-ivory/50 block">{item.category} • {item.material}</span>
                    <span className="text-xs text-gold font-semibold mt-1 block">₹{finalUnitPrice.toLocaleString('en-IN')} each</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-gold/10 pt-3 sm:pt-0">
                  {/* Quantity Control */}
                  <div className="flex items-center border border-gold/30 rounded-xl bg-ink">
                    <button
                      onClick={() => decrement(item.id)}
                      className="px-3 py-1.5 text-gold font-bold hover:bg-gold/10 rounded-l-xl text-xs"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-ivory">{item.qty}</span>
                    <button
                      onClick={() => increment(item.id)}
                      className="px-3 py-1.5 text-gold font-bold hover:bg-gold/10 rounded-r-xl text-xs"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <span className="text-base font-bold text-gold">₹{itemTotal.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-ivory/40 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <Link to="/shop" className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline pt-2">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Summary Sidebar */}
        <div className="bg-ink/90 border border-gold/30 rounded-2xl p-6 h-fit space-y-6 shadow-2xl">
          <h2 className="text-xl font-serif font-bold text-gold border-b border-gold/20 pb-3">Order Summary</h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-ivory/70">
              <span>Subtotal</span>
              <span className="font-semibold text-ivory">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount Savings</span>
                <span className="font-semibold">- ₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-ivory/70">
              <span>GST (3% Gold Jewellery Tax)</span>
              <span className="font-semibold text-ivory">₹{gst.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between text-ivory/70">
              <span>Insured Shipping</span>
              <span className="font-semibold text-emerald-400">
                {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}
              </span>
            </div>

            <div className="pt-3 border-t border-gold/20 flex justify-between text-base font-bold text-gold">
              <span>Grand Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-gradient-to-r from-gold to-amber-600 hover:from-amber-500 hover:to-gold text-ink font-bold text-sm rounded-xl shadow-xl transition-all flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>

          <div className="p-3 bg-gold/10 border border-gold/20 rounded-xl text-[11px] text-ivory/70 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
            <span>Encrypted SSL 256-bit safe checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
