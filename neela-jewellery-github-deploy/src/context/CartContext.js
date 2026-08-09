import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('neela_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync cart from backend when user logs in
  useEffect(() => {
    if (user) {
      api.get('/cart')
        .then(res => {
          if (Array.isArray(res.data)) {
            setItems(res.data);
          }
        })
        .catch(e => console.warn('Could not sync cart from backend'));
    }
  }, [user]);

  // Persist to local storage for guests
  useEffect(() => {
    localStorage.setItem('neela_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = async (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { ...product, qty }];
    });

    if (user) {
      try {
        await api.post('/cart', { productId: product.id, qty });
      } catch (e) {
        console.warn('Failed to sync add to cart with backend');
      }
    }
  };

  const removeFromCart = async (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    if (user) {
      try {
        await api.delete(`/cart/${id}`);
      } catch (e) {}
    }
  };

  const increment = async (id) => {
    let newQty = 1;
    setItems(prev => prev.map(i => {
      if (i.id === id) {
        newQty = i.qty + 1;
        return { ...i, qty: newQty };
      }
      return i;
    }));

    if (user) {
      try {
        await api.put(`/cart/${id}`, { qty: newQty });
      } catch (e) {}
    }
  };

  const decrement = async (id) => {
    let newQty = 0;
    setItems(prev => prev.map(i => {
      if (i.id === id) {
        newQty = Math.max(0, i.qty - 1);
        return { ...i, qty: newQty };
      }
      return i;
    }).filter(i => i.qty > 0));

    if (user) {
      try {
        await api.put(`/cart/${id}`, { qty: newQty });
      } catch (e) {}
    }
  };

  const clearCart = async () => {
    setItems([]);
    if (user) {
      try { await api.delete('/cart'); } catch (e) {}
    }
  };

  const count = items.reduce((sum, i) => sum + i.qty, 0);

  const subtotal = items.reduce((sum, i) => sum + (Number(i.price) * i.qty), 0);
  const discount = items.reduce((sum, i) => {
    const discPct = Number(i.discount_percent || 0);
    return sum + (Number(i.price) * (discPct / 100) * i.qty);
  }, 0);
  const netAmount = subtotal - discount;
  const gst = Math.round(netAmount * 0.03); // 3% GST
  const shipping = netAmount >= 10000 || netAmount === 0 ? 0 : 250;
  const total = Math.round(netAmount + gst + shipping);

  const value = {
    items,
    addToCart,
    removeFromCart,
    increment,
    decrement,
    clearCart,
    count,
    subtotal,
    discount,
    gst,
    shipping,
    total
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
