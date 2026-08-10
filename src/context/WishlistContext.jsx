import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('neela_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      api.get('/wishlist')
        .then(res => setWishlist(res.data))
        .catch(e => console.warn('Failed to sync wishlist with server'));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('neela_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = async (product) => {
    const pId = product.id;
    const exists = wishlist.some(i => i.id === pId);

    if (exists) {
      setWishlist(prev => prev.filter(i => i.id !== pId));
      if (user) {
        try { await api.delete(`/wishlist/${pId}`); } catch (e) {}
      }
    } else {
      setWishlist(prev => [product, ...prev]);
      if (user) {
        try { await api.post('/wishlist', { productId: pId }); } catch (e) {}
      }
    }
  };

  const isInWishlist = (productId) => wishlist.some(i => i.id === productId);

  const value = {
    wishlist,
    count: wishlist.length,
    toggleWishlist,
    isInWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
