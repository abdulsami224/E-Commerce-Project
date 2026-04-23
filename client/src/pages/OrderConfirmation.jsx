import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, MapPin, Phone, ShoppingBag, ChevronLeft, Printer } from 'lucide-react';
import API from '../api/axios';

const statusStyles = {
  pending:    'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  shipped:    'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  delivered:  'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  cancelled:  'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400',
};

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.log(err);
        navigate('/my-orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!order) return null;

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate('/my-orders')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 mb-6 transition"
        >
          <ChevronLeft size={16} /> Back to Orders
        </button>

        {/* Success Banner */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-8 text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-green-500" />
            </div>
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-800 dark:text-white mb-1">
            Order Confirmed!
          </h1>
          <p className="text-gray-400 text-sm mb-4">
            Thank you for your order. We'll process it shortly.
          </p>
          <div className="inline-flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl">
            <span className="text-xs text-gray-400">Order ID:</span>
            <span className="text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">
              {order._id}
            </span>
          </div>
        </div>

        {/* Invoice Card */}
        <div
          id="invoice"
          className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          {/* Invoice Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center">
                <ShoppingBag size={18} className="text-white" />
              </div>
              <div>
                <p className="font-heading font-bold text-gray-800 dark:text-white text-lg leading-tight">
                  ShopApp
                </p>
                <p className="text-xs text-gray-400">Order Receipt</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[order.status]}`}>
                {order.status.toUpperCase()}
              </span>
              <p className="text-xs text-gray-400 mt-1.5">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Shipping Details
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <MapPin size={14} className="text-red-400 flex-shrink-0" />
                <span>{order.shippingAddress?.street}, {order.shippingAddress?.city}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Phone size={14} className="text-red-400 flex-shrink-0" />
                <span>{order.shippingAddress?.phone}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Items Ordered
            </p>
            <div className="flex flex-col gap-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {/* Product image */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                    {item.product?.images?.[0]?.url ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product?.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={16} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white line-clamp-1">
                      {item.product?.title || 'Product'}
                    </p>
                    <p className="text-xs text-gray-400">
                      Rs. {item.price} × {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0">
                    Rs. {item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Subtotal ({order.items.length} items)</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Shipping</span>
                <span className="text-green-500 font-medium">Free</span>
              </div>
              <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
              <div className="flex justify-between font-bold text-gray-800 dark:text-white">
                <span>Total</span>
                <span className="text-red-500 text-lg">Rs. {order.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="px-6 py-4 text-center">
            <p className="text-xs text-gray-400">
              Questions about your order?{' '}
              <span className="text-red-500 font-medium cursor-pointer hover:underline">
                Contact Support
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-3 rounded-xl hover:border-red-400 hover:text-red-500 transition text-sm font-medium"
          >
            <Printer size={16} />
            Print Receipt
          </button>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition text-sm font-medium"
          >
            <ShoppingBag size={16} />
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;