import { useNavigate } from 'react-router-dom';
import useRecentlyViewed from '../hooks/useRecentlyViewed';

const RecentlyViewed = ({ currentProductId }) => {
  const { getProducts, clearAll } = useRecentlyViewed();

  // exclude current product from list
  const products = getProducts().filter(p => p._id !== currentProductId);

  if (products.length === 0) return null;

  const navigate = useNavigate();

  return (
    <div className="mt-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-bold text-gray-800 dark:text-white">
          Recently Viewed
        </h2>
        <button
          onClick={clearAll}
          className="text-xs text-gray-400 hover:text-red-500 transition"
        >
          Clear all
        </button>
      </div>

      {/* Products Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer hover:shadow-md hover:border-red-200 dark:hover:border-red-900 transition-all duration-200 group"
          >
            {/* Image */}
            <div className="h-28 overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={product.images?.[0]?.url || 'https://placehold.co/200x200?text=No+Image'}
                alt={product.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Info */}
            <div className="p-2.5">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-2 leading-tight">
                {product.title}
              </p>
              <p className="text-red-500 font-bold text-sm mt-1">
                Rs. {product.price}
              </p>
              {product.stock === 0 && (
                <span className="text-xs text-gray-400">Out of stock</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;