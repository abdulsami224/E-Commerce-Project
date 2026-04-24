import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import ImageSlider from '../components/ImageSlider';
import { useCart } from '../context/CartContext';
import { ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (product) document.title = `ShopApp | ${product.title}`;
    return () => { document.title = 'ShopApp'; }; // reset on leave
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    };
    fetchProduct();
  }, [id]); 

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }
    try {
      await addToCart(product._id, qty);
      toast.success(`${product.title.slice(0, 20)}... added to cart`);
      navigate('/cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (!product) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Back button skeleton */}
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-6" />

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">

          {/* Image skeleton */}
          <div className="md:w-1/2 h-72 md:h-auto bg-gray-200 dark:bg-gray-800 animate-pulse" />

          {/* Content skeleton */}
          <div className="md:w-1/2 p-8 flex flex-col gap-4">

            {/* Category badge */}
            <div className="w-20 h-5 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />

            {/* Title */}
            <div className="flex flex-col gap-2">
              <div className="w-full h-7 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
              <div className="w-3/4 h-7 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 mt-1">
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            </div>

            {/* Price */}
            <div className="w-28 h-9 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse mt-1" />

            {/* Stock */}
            <div className="w-36 h-4 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />

            {/* Qty selector */}
            <div className="w-32 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />

            {/* Add to cart button */}
            <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse mt-2" />
          </div>
        </div>
      </div>
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
            <ImageSlider images={product.images || []} />
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
              className={`w-full font-semibold py-3 rounded-xl transition mt-2 ${
                product.stock === 0
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;