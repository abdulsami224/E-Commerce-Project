import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', phone: '' });

  // coupon states
  const [couponCode, setCouponCode] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    document.title = 'ShopApp | Checkout';
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await API.get('/cart');
      const items = data.items || [];
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

  const cartTotal = cartItems.reduce((acc, item) => {
    return acc + (item.product?.price || 0) * item.quantity;
  }, 0);

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const handleChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    setCouponLoading(true);
    try {
      const { data } = await API.post('/coupons/validate', {
        code: couponInput,
        cartTotal
      });
      setCouponCode(data.code);
      setDiscountAmount(data.discountAmount);
      setCouponMessage(data.message);
      setCouponApplied(true);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      setCouponApplied(false);
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponInput('');
    setDiscountAmount(0);
    setCouponMessage('');
    setCouponApplied(false);
    toast.success('Coupon removed');
  };

  const handleOrder = async () => {
    if (!address.street || !address.city || !address.phone) {
      toast.error('Please fill all shipping fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/orders', {
        shippingAddress: address,
        couponCode: couponCode || null,
        discountAmount: discountAmount || 0
      });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-confirmation/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition text-sm";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Checkout
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Shipping Form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-700 dark:text-white mb-4 text-lg">
              Shipping Address
            </h3>
            <div className="flex flex-col gap-3">
              {['street', 'city', 'phone'].map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  onChange={handleChange}
                  className={inputClass}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-800 flex flex-col gap-4">
            <h3 className="font-semibold text-gray-700 dark:text-white text-lg">
              Order Summary
            </h3>

            {/* Items */}
            <div className="flex flex-col gap-2">
              {cartItems.map((item, index) => {
                const product = item.product;
                if (!product || typeof product !== 'object') return null;
                return (
                  <div key={item._id || index} className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span className="line-clamp-1 flex-1 mr-2">
                      {product.title} × {item.quantity}
                    </span>
                    <span className="flex-shrink-0">Rs. {product.price * item.quantity}</span>
                  </div>
                );
              })}
            </div>

            {/* Coupon Input */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                Coupon Code
              </label>

              {!couponApplied ? (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition text-sm uppercase"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="px-4 py-2.5 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white text-sm rounded-xl transition disabled:opacity-50 font-medium flex-shrink-0"
                  >
                    {couponLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : 'Apply'}
                  </button>
                </div>
              ) : (
                // Applied coupon badge
                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" />
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {couponCode}
                    </span>
                    <span className="text-xs text-green-500">{couponMessage}</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-green-400 hover:text-red-500 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex flex-col gap-2">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Subtotal</span>
                <span>Rs. {cartTotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-500">
                  <span>Discount ({couponCode})</span>
                  <span>− Rs. {discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Shipping</span>
                <span className="text-green-500 font-medium">Free</span>
              </div>
              <div className="h-px bg-gray-100 dark:bg-gray-800" />
              <div className="flex justify-between font-bold text-gray-800 dark:text-white">
                <span>Total</span>
                <span className="text-red-500 text-xl">Rs. {finalTotal}</span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={loading || cartItems.length === 0}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : '✓ Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;