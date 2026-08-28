import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, onToast }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWished = isInWishlist(product.id);
  const discountPct = Number(product.discount_percent || 0);
  const finalPrice = discountPct > 0
    ? Math.round(Number(product.price) * (1 - discountPct / 100))
    : Number(product.price);

  const imageUrl =
    product.images?.[0]?.image_url ||
    product.images?.[0] ||
    product.image_url ||
    product.image ||
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80';

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    if (onToast) onToast(`"${product.name}" added to cart!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    if (onToast) onToast(isWished ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <Link to={`/product/${product.id}`} className="group relative bg-ink/80 border border-gold/20 hover:border-gold rounded-2xl overflow-hidden shadow-lg hover:shadow-gold/10 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-ink">
        {discountPct > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-gold text-ink text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discountPct}%
          </span>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-ink/60 hover:bg-ink border border-gold/20 transition-all"
        >
          <Heart className={`w-4 h-4 ${isWished ? 'text-rose-500 fill-rose-500' : 'text-ivory/70'}`} />
        </button>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="text-[10px] uppercase tracking-widest text-gold/70 font-semibold">{product.category}</span>
        <h3 className="text-sm font-serif text-ivory font-semibold line-clamp-2 leading-snug">{product.name}</h3>
        <div className="flex items-center gap-1 text-gold text-xs">
          <Star className="w-3 h-3 fill-gold" />
          <span>{product.rating || 4.8}</span>
        </div>
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-base font-bold text-gold">₹{finalPrice.toLocaleString('en-IN')}</span>
          {discountPct > 0 && (
            <span className="text-xs text-ivory/40 line-through">₹{Number(product.price).toLocaleString('en-IN')}</span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-2 w-full py-2 bg-gold/10 border border-gold/30 hover:bg-gold hover:text-ink text-gold text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
        </button>
      </div>
    </Link>
  );
}
