import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X, Shield, LogOut, PackageCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isAdmin, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur-md border-b border-gold/20 text-ivory">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-gold/20 to-amber-950 text-gold text-[11px] font-medium py-1.5 px-4 text-center tracking-wider border-b border-gold/10">
        ✨ COMPLIMENTARY INSURED PAN-INDIA DELIVERY & HALLMARK PURITY GUARANTEE ON ALL ORDERS ✨
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center text-ink font-serif font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
            N
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-semibold text-gold tracking-widest block leading-none">
              NEELA
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-ivory/60 block">
              Jewellery
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-wider text-ivory/80">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <Link to="/shop" className="hover:text-gold transition-colors">Shop Catalog</Link>
          <Link to="/shop?category=Rings" className="hover:text-gold transition-colors">Rings</Link>
          <Link to="/shop?category=Necklaces" className="hover:text-gold transition-colors">Necklaces</Link>
          <Link to="/about" className="hover:text-gold transition-colors">Our Heritage</Link>
          <Link to="/contact" className="hover:text-gold transition-colors">Contact</Link>
        </div>

        {/* Search Bar & Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
            <input
              type="text"
              placeholder="Search solitaire, emeralds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 xl:w-60 py-1.5 pl-3 pr-8 bg-ink/90 border border-gold/30 rounded-full text-xs text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold transition-all"
            />
            <button type="submit" className="absolute right-2.5 text-gold/70 hover:text-gold">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="p-2 text-ivory/80 hover:text-gold hover:bg-gold/10 rounded-full transition-all relative"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="p-2 text-ivory/80 hover:text-gold hover:bg-gold/10 rounded-full transition-all relative"
            title="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-ink text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Account Menu */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 p-1.5 rounded-full bg-gold/10 border border-gold/30 hover:bg-gold/20 text-gold transition-all text-xs font-semibold"
              >
                <div className="w-6 h-6 rounded-full bg-gold text-ink flex items-center justify-center font-bold text-xs uppercase">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{user.name}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="p-2 text-ivory/80 hover:text-gold hover:bg-gold/10 rounded-full transition-all flex items-center gap-1 text-xs font-medium"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Dropdown Menu */}
            {userDropdownOpen && user && (
              <div
                className="absolute right-0 mt-2 w-52 bg-ink border border-gold/30 rounded-xl shadow-2xl py-2 z-50 text-xs animate-slide-up"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-gold/10">
                  <p className="font-semibold text-ivory truncate">{user.name}</p>
                  <p className="text-ivory/50 text-[11px] truncate">{user.email}</p>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gold hover:bg-gold/10 font-semibold"
                  >
                    <Shield className="w-4 h-4" /> Admin Portal
                  </Link>
                )}

                <Link
                  to="/profile"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-ivory/80 hover:bg-gold/10 hover:text-gold"
                >
                  <User className="w-4 h-4" /> Account Profile
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-ivory/80 hover:bg-gold/10 hover:text-gold"
                >
                  <PackageCheck className="w-4 h-4" /> My Orders
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-950/30 border-t border-gold/10 mt-1"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-ivory hover:text-gold"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ink border-b border-gold/20 px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative my-2">
            <input
              type="text"
              placeholder="Search jewellery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-3 pr-8 bg-ink/90 border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40"
            />
            <button type="submit" className="absolute right-2.5 text-gold">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col gap-2 text-sm text-ivory/90 font-medium">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-gold">Home</Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-gold">Shop Catalog</Link>
            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-gold">Wishlist ({wishlistCount})</Link>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-gold">Cart ({cartCount})</Link>
            {user ? (
              <>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-gold">My Orders</Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-gold">My Account</Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="py-1 text-gold font-bold">Admin Portal</Link>
                )}
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="py-1 text-rose-400 text-left">Sign Out</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="py-1 text-gold font-bold">Sign In / Register</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
