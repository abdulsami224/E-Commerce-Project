import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'ShopApp | My Wishlist';
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await API.get('/wishlist');
      setProducts(data.products || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    await toggleWishlist(productId);
    setProducts(prev => prev.filter(p => p._id !== productId));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = async (product) => {
    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }
    await addToCart(product._id, 1);
    toast.success('Added to cart 🛒');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
            <Heart size={20} className="text-primary-500" fill="currentColor" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-gray-800 dark:text-white">
              My Wishlist
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {products.length} saved item{products.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
              <Heart size={36} className="text-red-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
              Your wishlist is empty
            </h2>
            <p className="text-gray-400 text-sm">
              Save products you love by clicking the heart icon
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl transition text-sm font-medium mt-2"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow hover:shadow-md transition group"
              >
                {/* Image */}
                <div
                  className="h-48 overflow-hidden cursor-pointer relative"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <img
                    src={product.images?.[0]?.url || 'https://placehold.co/300x300?text=No+Image'}
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="bg-white/90 dark:bg-gray-900/90 text-xs font-medium px-3 py-1 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-500 px-2 py-0.5 rounded-full">
                    {product.category}
                  </span>
                  <p
                    className="text-sm font-medium text-gray-800 dark:text-white mt-2 line-clamp-1 cursor-pointer hover:text-primary-500 transition"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    {product.title}
                  </p>
                  <p className="text-primary-500 font-bold mt-1">Rs. {product.price}</p>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs py-2 rounded-xl transition font-medium"
                    >
                      <ShoppingCart size={12} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-400 hover:text-primary-500 text-gray-400 transition flex-shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;