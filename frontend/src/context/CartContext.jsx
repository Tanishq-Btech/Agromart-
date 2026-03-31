import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('agromart_cart');
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const saveCart = (items) => {
    setCart(items);
    localStorage.setItem('agromart_cart', JSON.stringify(items));
  };

  const addToCart = (product, quantity = 1) => {
    const existing = cart.find(i => i._id === product._id);
    if (existing) {
      const updated = cart.map(i =>
        i._id === product._id ? { ...i, cartQty: i.cartQty + quantity } : i
      );
      saveCart(updated);
    } else {
      saveCart([...cart, { ...product, cartQty: quantity }]);
    }
  };

  const removeFromCart = (id) => {
    saveCart(cart.filter(i => i._id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    saveCart(cart.map(i => i._id === id ? { ...i, cartQty: qty } : i));
  };

  const clearCart = () => saveCart([]);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.cartQty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.cartQty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount, cartOpen, setCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
