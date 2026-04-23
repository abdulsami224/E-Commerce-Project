import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100 dark:border-gray-800"
    >
      <div className="overflow-hidden h-52">
      <img
        src={product.images?.[0]?.url || 'https://placehold.co/300x300?text=No+Image'}
        alt={product.title}
        loading="lazy"
        decoding="async"   
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      </div>
      {/* <div className="p-4">
        <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-500 px-2 py-0.5 rounded-full font-medium">
          {product.category}
        </span>
        <h3 className="font-semibold text-gray-800 dark:text-white mt-2 text-sm line-clamp-1">
          {product.title}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <p className="text-red-500 font-bold text-lg">Rs. {product.price}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-gray-100 text-gray-400'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div> */}

      <div className="p-4">
        {/* Category + Out of Stock badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-500 px-2 py-0.5 rounded-full font-medium">
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

        <div className="flex items-center justify-between mt-3">
          <p className="text-red-500 font-bold text-lg">Rs. {product.price}</p>

          {/* Disable button if out of stock */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // don't trigger card click
              if (product.stock > 0) window.location.href = `/product/${product._id}`;
            }}
            disabled={product.stock === 0}
            className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${
              product.stock > 0
                ? 'bg-red-500 hover:bg-red-600 text-white'
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