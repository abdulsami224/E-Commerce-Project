import { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]); // store only IDs for fast lookup

  // fetch wishlist on login
  useEffect(() => {
    if (user) fetchWishlist();
    else setWishlistIds([]);
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data } = await API.get('/wishlist');
      const ids = (data.products || []).map(p =>
        typeof p === 'object' ? p._id : p
      );
      setWishlistIds(ids);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      const { data } = await API.post('/wishlist/toggle', { productId });
      if (data.added) {
        setWishlistIds(prev => [...prev, productId]);
      } else {
        setWishlistIds(prev => prev.filter(id => id !== productId));
      }
      return data.added; // return true/false for toast message
    } catch (err) {
      console.log(err);
    }
  };

  const isWishlisted = (productId) => wishlistIds.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);