import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import OrderTimeline from '../components/OrderTimeline';

const statusStyles = {
  pending:    'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  shipped:    'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  delivered:  'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  cancelled:  'bg-primary-100 text-primary-500 dark:bg-primary-900/30 dark:text-primary-400',
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'ShopApp | My Orders';
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/my');
      setOrders(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (orderId) => {
    // use toast confirm instead of window.confirm
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-sm">Cancel this order?</p>
        <p className="text-xs text-gray-400">
          Stock will be restored automatically.
        </p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await API.put(`/orders/${orderId}/cancel`);
                toast.success('Order cancelled successfully');
                fetchOrders(); // ← refresh orders list
              } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to cancel order');
              }
            }}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-xs py-1.5 rounded-lg transition"
          >
            Yes, Cancel
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs py-1.5 rounded-lg hover:border-primary-400 transition"
          >
            Keep Order
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (orders.length === 0) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4">
      <p className="text-5xl">📦</p>
      <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">No orders yet</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading text-3xl font-bold text-gray-800 dark:text-white mb-8">
          My Orders
        </h2>

        <div className="flex flex-col gap-4">
         {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 gap-2">
              <div>
                <p className="text-xs text-gray-400">Order ID</p>
                <p className="text-sm font-mono text-gray-600 dark:text-gray-300">
                  {order._id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[order.status]}`}>
                  {order.status.toUpperCase()}
                </span>
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    <X size={11} /> Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="px-6 py-4 flex flex-col gap-2">
              {order.items.map((item) => (
                <div key={item.product?._id} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{item.product?.title} × {item.quantity}</span>
                  <span>Rs. {item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                📍 {order.shippingAddress?.city} — {order.shippingAddress?.phone}
              </p>
              <div className="flex items-center gap-3">
                <p className="font-bold text-primary-500">Rs. {order.totalPrice}</p>
                <button
                  onClick={() => navigate(`/order-confirmation/${order._id}`)}
                  className="text-xs text-gray-400 hover:text-primary-500 transition underline underline-offset-2"
                >
                  View Receipt
                </button>
                {/* Toggle timeline */}
                <button
                  onClick={() => setExpandedOrder(
                    expandedOrder === order._id ? null : order._id
                  )}
                  className="text-xs text-gray-400 hover:text-primary-500 transition underline underline-offset-2"
                >
                  {expandedOrder === order._id ? 'Hide Timeline' : 'Track Order'}
                </button>
              </div>
            </div>

            {/* Timeline — shown when expanded */}
            {expandedOrder === order._id && (
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
                <OrderTimeline
                  status={order.status}
                  timeline={order.timeline || []}
                />
              </div>
            )}

          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;