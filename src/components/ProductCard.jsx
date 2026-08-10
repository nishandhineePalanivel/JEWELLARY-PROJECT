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

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    if (onToast) onToast(`Added "${product.name}" to cart!`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (onToast) {
      onToast(isWished ? `Removed from wishlist` : `Added "${product.name}" to wishlist!`);
    }
  };

const imageUrl =
  product.image ||
  product.images?.[0]?.image_url ||
  product.images?.[0] ||
  product.image_url;
  
  return (
    <div className="group relative bg-ink/60 border border-gold/20 hover:border-gold/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-gold/10 flex flex-col justify-between">
      {/* Discount Badge */}
      {discountPct > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-600 to-gold text-ink text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
          {discountPct}% OFF
        </div>
      )}

      {/* Wishlist Toggle Button */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-3 right-3 z-10 p-2 bg-ink/70 backdrop-blur-md border border-gold/30 rounded-full hover:bg-gold/20 transition-all text-ivory"
      >
        <Heart className={`w-4 h-4 ${isWished ? 'text-rose-500 fill-rose-500' : 'text-ivory/80'}`} />
      </button>

      {/* Product Image & Swatch Preview */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gradient-to-br from-gold/5 to-transparent">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        <div
          className={`w-full h-full flex flex-col items-center justify-center p-6 text-center ${imageUrl ? 'hidden' : 'flex'}`}
          style={{ backgroundColor: product.swatch || '#2A1F1D' }}
        >
          <div className="w-16 h-16 rounded-full border-2 border-gold/40 shadow-inner mb-2 bg-gold/20 flex items-center justify-center text-gold font-serif text-lg font-bold">
            {product.category?.charAt(0) || 'NJ'}
          </div>
          <span className="text-xs font-serif text-ivory/80 tracking-wider uppercase">{product.category}</span>
        </div>
      </Link>

      {/* Product Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center text-xs text-ivory/60 mb-1">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-gold font-medium">
              <Star className="w-3.5 h-3.5 fill-gold" />
              <span>{product.rating || 4.8}</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-serif text-base font-medium text-ivory group-hover:text-gold transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-ivory/50 mt-1 line-clamp-1">{product.material}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-gold/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-ivory/40 block">Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gold">₹{finalPrice.toLocaleString('en-IN')}</span>
              {discountPct > 0 && (
                <span className="text-xs text-ivory/40 line-through">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2.5 bg-gold/10 border border-gold/40 hover:bg-gold hover:text-ink text-gold rounded-xl transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
