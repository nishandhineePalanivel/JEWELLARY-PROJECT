import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Star, ShieldCheck, Truck, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { DetailSkeleton } from '../components/SkeletonLoader';
import ReviewSection from '../components/ReviewSection';
import Toast from '../components/Toast';
import api from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

const fetchProductDetails = useCallback(async () => {
  setLoading(true);

  try {
    const res = await api.get(`/products/${id}`);
    setProduct(res.data);

    const mainImg =
      res.data.images?.[0]?.image_url ||
      res.data.images?.[0] ||
      res.data.image_url;

    setSelectedImage(mainImg);

  } catch (e) {
    console.warn('Failed to fetch product details');
  } finally {
    setLoading(false);
  }

}, [id]);


useEffect(() => {
  fetchProductDetails();
}, [fetchProductDetails]);

  if (loading) return <DetailSkeleton />;

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-ivory space-y-4">
        <h2 className="text-2xl font-serif text-gold">Product Not Found</h2>
        <p className="text-xs text-ivory/60">The requested jewellery piece does not exist in our catalog.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-gold text-ink font-bold text-xs rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isWished = isInWishlist(product.id);
  const discountPct = Number(product.discount_percent || 0);
  const finalPrice = discountPct > 0 
    ? Math.round(Number(product.price) * (1 - discountPct / 100))
    : Number(product.price);

  const imagesList = product.images?.length > 0 
    ? product.images.map(img => img.image_url || img)
    : [product.image_url].filter(Boolean);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setToastMsg(`Added ${qty} x "${product.name}" to your cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-10 text-ivory">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-ivory/70 hover:text-gold mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Collections
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-gold/30 bg-ink/80 shadow-2xl flex items-center justify-center">
            {discountPct > 0 && (
              <span className="absolute top-4 left-4 z-10 bg-gold text-ink text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                SAVE {discountPct}%
              </span>
            )}

            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}

            <div
              className={`w-full h-full flex flex-col items-center justify-center p-8 text-center ${selectedImage ? 'hidden' : 'flex'}`}
              style={{ backgroundColor: product.swatch || '#2A1F1D' }}
            >
              <div className="w-24 h-24 rounded-full border-2 border-gold/40 shadow-inner mb-3 bg-gold/20 flex items-center justify-center text-gold font-serif text-3xl font-bold">
                {product.category?.charAt(0) || 'NJ'}
              </div>
              <span className="text-sm font-serif text-gold tracking-widest uppercase">{product.category}</span>
            </div>
          </div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img ? 'border-gold shadow-md' : 'border-gold/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gold uppercase tracking-widest">{product.category}</span>
              <span className="text-xs text-ivory/50 font-mono">SKU: {product.sku || 'NJ-ART-001'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif text-ivory font-bold mt-1">{product.name}</h1>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-gold text-sm font-semibold">
                <Star className="w-4 h-4 fill-gold text-gold" />
                <span>{product.rating || 4.8}</span>
              </div>
              <span className="text-xs text-ivory/40">•</span>
              <span className="text-xs text-ivory/60">Verified Hallmark Purity</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-ink/80 border border-gold/20 rounded-2xl space-y-1">
            <span className="text-xs text-ivory/50 block">Inclusive of all local taxes</span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gold">₹{finalPrice.toLocaleString('en-IN')}</span>
              {discountPct > 0 && (
                <span className="text-base text-ivory/40 line-through">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Key Specifications */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-ink/60 border border-gold/15 rounded-xl">
              <span className="text-ivory/50 block">Material & Gems</span>
              <span className="font-semibold text-ivory">{product.material}</span>
            </div>
            <div className="p-3 bg-ink/60 border border-gold/15 rounded-xl">
              <span className="text-ivory/50 block">Gold Net Weight</span>
              <span className="font-semibold text-ivory">{product.weight_grams ? `${product.weight_grams} g` : 'Standard'}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">Description</h4>
            <p className="text-xs text-ivory/70 leading-relaxed font-light">{product.description}</p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 text-xs">
            {product.stock > 0 ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle className="w-4 h-4" /> In Stock ({product.stock} pieces remaining)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                <AlertTriangle className="w-4 h-4" /> Made to Order / Out of Stock
              </span>
            )}
          </div>

          {/* Quantity Selector & Wishlist Button */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-gold/30 rounded-xl bg-ink">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 text-gold font-bold hover:bg-gold/10 rounded-l-xl"
              >
                -
              </button>
              <span className="px-4 text-xs font-bold text-ivory">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-2 text-gold font-bold hover:bg-gold/10 rounded-r-xl"
              >
                +
              </button>
            </div>

            <button
              onClick={() => {
                toggleWishlist(product);
                setToastMsg(isWished ? 'Removed from wishlist' : 'Added to wishlist');
              }}
              className="p-3 border border-gold/30 hover:border-gold rounded-xl text-ivory hover:text-rose-400 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isWished ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={handleAddToCart}
              className="py-3.5 bg-gold/10 border border-gold hover:bg-gold hover:text-ink text-gold font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="py-3.5 bg-gradient-to-r from-gold to-amber-600 hover:from-amber-500 hover:to-gold text-ink font-bold text-sm rounded-xl shadow-xl transition-all"
            >
              Buy Now Directly
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-gold/10 grid grid-cols-3 gap-2 text-[11px] text-ivory/60 text-center">
            <span className="flex flex-col items-center gap-1"><ShieldCheck className="w-4 h-4 text-gold" /> BIS Hallmarked</span>
            <span className="flex flex-col items-center gap-1"><Truck className="w-4 h-4 text-gold" /> Insured Delivery</span>
            <span className="flex flex-col items-center gap-1"><RefreshCw className="w-4 h-4 text-gold" /> Lifetime Buyback</span>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ReviewSection
        productId={product.id}
        reviews={product.reviews || []}
        onReviewAdded={fetchProductDetails}
      />
    </div>
  );
}
