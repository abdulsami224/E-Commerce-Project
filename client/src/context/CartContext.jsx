import { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Fetch cart on login
  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const fetchCart = async () => {
    const { data } = await API.get('/cart');
    setCart(data.items || []);
  };

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await API.post('/cart', { productId, quantity });
    setCart(data.items);
  };

  const removeFromCart = async (productId) => {
    const { data } = await API.delete(`/cart/${productId}`);
    setCart(data.items);
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await API.put('/cart', { productId, quantity });
    setCart(data.items);
  };

  const clearCart = async () => {
    await API.delete('/cart/clear');
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity, 0
  );

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);