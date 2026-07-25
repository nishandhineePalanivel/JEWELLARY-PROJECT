import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find((i) => i.id === action.product.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { ...action.product, qty: 1 }];
    }
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id);
    case 'INCREMENT':
      return state.map((i) =>
        i.id === action.id ? { ...i, qty: i.qty + 1 } : i
      );
    case 'DECREMENT':
      return state
        .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const value = {
    items,
    addToCart: (product) => dispatch({ type: 'ADD', product }),
    removeFromCart: (id) => dispatch({ type: 'REMOVE', id }),
    increment: (id) => dispatch({ type: 'INCREMENT', id }),
    decrement: (id) => dispatch({ type: 'DECREMENT', id }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
    count: items.reduce((sum, i) => sum + i.qty, 0),
    total: items.reduce((sum, i) => sum + i.qty * i.price, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
