const MAX = 5;
const KEY = 'recentlyViewed';

const useRecentlyViewed = () => {

  const getAll = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  };

  const addProduct = (product) => {
    const existing = getAll();

    // remove if already exists to avoid duplicate
    const filtered = existing.filter(p => p._id !== product._id);

    // add to front, keep max 5
    const updated = [product, ...filtered].slice(0, MAX);

    localStorage.setItem(KEY, JSON.stringify(updated));
  };

  const getProducts = () => getAll();

  const clearAll = () => localStorage.removeItem(KEY);

  return { addProduct, getProducts, clearAll };
};

export default useRecentlyViewed;