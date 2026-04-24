import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', phone: '' });

  useEffect(() => { document.title = 'ShopApp | Checkout'; }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await API.get('/cart');
        const items = data.items || [];

        // ← redirect to cart if empty
        if (items.length === 0) {
          toast.error('Your cart is empty');
          navigate('/cart');
          return;
        }

        setCartItems(items);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCart();
  }, []);

  // Calculate total from fresh data
  const cartTotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handleOrder = async () => {
    if (!address.street || !address.city || !address.phone) {
      toast.error('Please fill all shipping fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/orders', { shippingAddress: address });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-confirmation/${data._id}`);  
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading text-3xl font-bold text-gray-800 dark:text-white mb-8">Checkout</h2>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Shipping Form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-700 dark:text-white mb-4 text-lg">Shipping Address</h3>
            <div className="flex flex-col gap-3">
              {['street', 'city', 'phone'].map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-700 dark:text-white mb-4 text-lg">Order Summary</h3>

            <div className="flex flex-col gap-2 mb-4">
              {cartItems.map((item, index) => {
                const product = item.product;
                if (!product || typeof product !== 'object') return null;
                return (
                  <div
                    key={item._id || index}  // ← item._id not product._id
                    className="flex justify-between text-sm text-gray-500 dark:text-gray-400"
                  >
                    <span>{product.title} × {item.quantity}</span>
                    <span>Rs. {product.price * item.quantity}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-800 dark:text-white">
              <span>Total</span>
              <span className="text-red-500 text-xl">Rs. {cartTotal}</span>
            </div>

            <button
              onClick={handleOrder}
              disabled={loading || cartItems.length === 0}
              className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : '✓ Place Order'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;