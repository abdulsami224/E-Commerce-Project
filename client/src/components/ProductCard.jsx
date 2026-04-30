import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();

  const wishlisted = isWishlisted(product._id);

  const handleWishlist = async (e) => {
    e.stopPropagation(); // ← prevent card click
    if (!user) {
      toast.error('Please login to save wishlist');
      return;
    }
    const added = await toggleWishlist(product._id);
    toast.success(added ? 'Added to wishlist ❤️' : 'Removed from wishlist');
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100 dark:border-gray-800"
    >
      <div className="overflow-hidden h-52 relative">
        <img
          src={product.images?.[0]?.url || 'https://placehold.co/300x300?text=No+Image'}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Heart button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
            wishlisted
              ? 'bg-primary-500 text-white scale-110'
              : 'bg-white/80 dark:bg-gray-900/80 text-gray-400 hover:text-primary-500 hover:scale-110'
          }`}
        >
          <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="bg-white/90 dark:bg-gray-900/90 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-500 px-2 py-0.5 rounded-full font-medium">
            {product.category}
          </span>
          {product.stock === 0 && (
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full font-medium">
              Out of Stock
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-800 dark:text-white mt-2 text-sm line-clamp-1">
          {product.title}
        </h3>

        {product.totalReviews > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {Number(product.averageRating).toFixed(1)}
              <span className="text-gray-400"> ({product.totalReviews})</span>
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <p className="text-primary-500 font-bold text-lg">Rs. {product.price}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.stock > 0) navigate(`/product/${product._id}`);
            }}
            disabled={product.stock === 0}
            className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${
              product.stock > 0
                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
          >
            {product.stock > 0 ? 'View' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;