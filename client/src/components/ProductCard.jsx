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
        decoding="async"   // ← decode off main thread
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      </div>
      <div className="p-4">
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
      </div>
    </div>
  );
};

export default ProductCard;