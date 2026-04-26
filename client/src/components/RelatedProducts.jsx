import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const RelatedProducts = ({ productId, category }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!productId) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${productId}/related`);
        setRelated(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [productId]);

  if (!loading && related.length === 0) return null;

  return (
    <div className="mt-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-heading text-xl font-bold text-gray-800 dark:text-white">
            Related Products
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            More from{' '}
            <span className="text-red-400 font-medium capitalize">{category}</span>
          </p>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="h-40 bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="p-3 flex flex-col gap-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mt-1" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {related.map((product) => (
            <div
              key={product._id}
              onClick={() => {
                navigate(`/product/${product._id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer hover:shadow-md hover:border-red-200 dark:hover:border-red-900 transition-all duration-200 group"
            >
              {/* Image */}
              <div className="h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={product.images?.[0]?.url || 'https://placehold.co/200x200?text=No+Image'}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <div className="p-3">
                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-500 px-2 py-0.5 rounded-full font-medium capitalize">
                  {product.category}
                </span>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-2 leading-tight mt-2">
                  {product.title}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-red-500 font-bold">
                    Rs. {product.price}
                  </p>
                  {product.stock === 0 && (
                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                      Out of stock
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;