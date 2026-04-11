import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { ChevronLeft } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    };
    fetch();
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart(product._id, qty);
    navigate('/cart');
  };

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 mb-6 transition"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 h-72 md:h-auto">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="md:w-1/2 p-8 flex flex-col justify-center gap-4">
            <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-500 px-3 py-1 rounded-full w-fit font-medium">
              {product.category}
            </span>
            <h1 className="font-heading text-3xl font-bold text-gray-800 dark:text-white">{product.title}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{product.description}</p>
            <p className="text-red-500 font-bold text-3xl">Rs. {product.price}</p>
            <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-500' : 'text-gray-400'}`}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">Qty:</span>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white transition">−</button>
                <span className="px-4 py-2 text-gray-800 dark:text-white font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white transition">+</button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;