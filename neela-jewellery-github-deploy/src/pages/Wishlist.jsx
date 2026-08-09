import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Toast from '../components/Toast';

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [toastMsg, setToastMsg] = React.useState('');

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    toggleWishlist(product);
    setToastMsg(`Moved "${product.name}" to shopping bag!`);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-20 text-center text-ivory space-y-6">
        <div className="w-20 h-20 bg-rose-950/40 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto text-rose-400">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-serif text-gold font-bold">Your Wishlist is Empty</h2>
        <p className="text-xs text-ivory/60 max-w-md mx-auto">
          Save your favourite solitaires, emerald halos, and royal bangles to revisit anytime.
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
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div className="mb-8 border-b border-gold/20 pb-4">
        <h1 className="text-3xl font-serif font-bold text-gold">Saved Wishlist</h1>
        <p className="text-xs text-ivory/60 mt-1">{wishlist.length} item(s) saved for later</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => {
          const discountPct = Number(item.discount_percent || 0);
          const finalPrice = discountPct > 0 
            ? Math.round(Number(item.price) * (1 - discountPct / 100))
            : Number(item.price);
          const imgUrl = item.images?.[0]?.image_url || item.images?.[0] || item.image_url;

          return (
            <div
              key={item.id}
              className="bg-ink/80 border border-gold/20 hover:border-gold/50 rounded-2xl overflow-hidden transition-all shadow-lg flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-ink overflow-hidden flex items-center justify-center">
                {imgUrl ? (
                  <img src={imgUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gold font-serif text-3xl font-bold">{item.category?.charAt(0) || 'NJ'}</div>
                )}
                <button
                  onClick={() => toggleWishlist(item)}
                  className="absolute top-3 right-3 p-2 bg-ink/80 text-rose-500 rounded-full border border-rose-500/30 hover:bg-rose-950 transition-all"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-gold uppercase tracking-wider block">{item.category}</span>
                  <Link to={`/product/${item.id}`} className="font-serif text-base font-semibold text-ivory hover:text-gold transition-colors line-clamp-1">
                    {item.name}
                  </Link>
                  <span className="text-xs text-ivory/50 block mt-1">{item.material}</span>
                </div>

                <div className="pt-2 border-t border-gold/10 space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gold">₹{finalPrice.toLocaleString('en-IN')}</span>
                    {discountPct > 0 && (
                      <span className="text-xs text-ivory/40 line-through">₹{Number(item.price).toLocaleString('en-IN')}</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full py-2.5 bg-gold text-ink font-bold text-xs rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" /> Move to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
