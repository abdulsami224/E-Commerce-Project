import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Cart = () => {
  const { removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/cart');
      setCartItems(data.items || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    fetchCart();
  };

  const handleUpdate = async (productId, qty) => {
    if (qty < 1) return;
    await updateQuantity(productId, qty);
    fetchCart(); 
  };

  const cartTotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (cartItems.length === 0) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4">
      <p className="text-5xl">🛒</p>
      <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">Your cart is empty</h2>
      <button
        onClick={() => navigate('/')}
        className="bg-red-500 text-white px-6 py-2.5 rounded-xl hover:bg-red-600 transition"
      >
        Shop Now
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading text-3xl font-bold text-gray-800 dark:text-white mb-8">Your Cart</h2>

        <div className="flex flex-col gap-4">
          {cartItems.map((item, index) => {
            const product = item.product;
            // safety check — skip if product not populated
            if (!product || typeof product !== 'object') return null;

            return (
              <div
                key={item._id || index}  // ← use item._id, fallback to index
                className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 flex flex-col sm:flex-row items-center gap-4 border border-gray-100 dark:border-gray-800"
              >
              <img
                src={product.images?.[0]?.url || 'https://placehold.co/80x80?text=No+Image'}
                alt={product.title}
                className="w-14 h-14 rounded-xl object-cover"
              />
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-semibold text-gray-800 dark:text-white">{product.title}</h4>
                  <p className="text-red-500 font-bold">Rs. {product.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleUpdate(product._id, item.quantity - 1)}
                    disabled={item.quantity === 1}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="px-4 text-gray-800 dark:text-white font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdate(product._id, item.quantity + 1)}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    +
                  </button>
                </div>

                {/* Item Total */}
                <p className="font-bold text-gray-700 dark:text-gray-200 w-24 text-right">
                  Rs. {product.price * item.quantity}
                </p>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(product._id)}
                  className="text-red-400 hover:text-red-600 text-xl transition"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {/* Cart Summary */}
        <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Total Amount</span>
            <span className="text-2xl font-bold text-red-500">Rs. {cartTotal}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition"
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;