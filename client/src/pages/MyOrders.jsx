import { useEffect, useState } from 'react';
import API from '../api/axios';

const statusStyles = {
  pending:    'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30',
  processing: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
  shipped:    'bg-purple-100 text-purple-600 dark:bg-purple-900/30',
  delivered:  'bg-green-100 text-green-600 dark:bg-green-900/30',
  cancelled:  'bg-red-100 text-red-500 dark:bg-red-900/30',
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.title = 'ShopApp | My Orders'; }, []);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await API.get('/orders/my');
      setOrders(data);
      setLoading(false);
    };
    fetch();
  }, []);

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
        <h2 className="font-heading text-3xl font-bold text-gray-800 dark:text-white mb-8">My Orders</h2>
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 gap-2">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="text-sm font-mono text-gray-600 dark:text-gray-300">{order._id}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${statusStyles[order.status]}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div className="px-6 py-4 flex flex-col gap-2">
                {order.items.map((item) => (
                  <div key={item.product?._id} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{item.product?.title} × {item.quantity}</span>
                    <span>Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <p className="text-xs text-gray-400">
                  📍 {order.shippingAddress?.city} — {order.shippingAddress?.phone}
                </p>
                <p className="font-bold text-red-500">Rs. {order.totalPrice}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;