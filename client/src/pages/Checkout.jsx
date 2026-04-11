import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cartTotal, clearCart, cart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: '', city: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handleOrder = async () => {
    if (!address.street || !address.city || !address.phone) {
      alert('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await API.post('/orders', { shippingAddress: address });
      clearCart();
      navigate('/my-orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed');
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
              {cart.map((item) => (
                <div key={item.product._id} className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{item.product.title} × {item.quantity}</span>
                  <span>Rs. {item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-800 dark:text-white">
              <span>Total</span>
              <span className="text-red-500 text-xl">Rs. {cartTotal}</span>
            </div>
            <button
              onClick={handleOrder} disabled={loading}
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