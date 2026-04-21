import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import API from '../../api/axios';

const statusStyles = {
  pending:    'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  shipped:    'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  delivered:  'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  cancelled:  'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchOrders = async () => {
    const { data } = await API.get('/orders/all');
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, status) => {
    await API.put(`/orders/${orderId}/status`, { status });
    fetchOrders();
  };

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-red-400 transition text-gray-500 dark:text-gray-400"
            >
              <ChevronLeft size={18} />
            </Link>
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-800 dark:text-white">
                Manage Orders
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{orders.length} orders total</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-1">
            {['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  filter === s
                    ? 'bg-red-500 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="sm:hidden w-full mb-4 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
        >
          <option value="">All Orders</option>
          {['pending','processing','shipped','delivered','cancelled'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        {/* Orders List */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <ShoppingBag size={48} strokeWidth={1} />
            <p>No orders found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((order) => (
              <div key={order._id} className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 overflow-hidden">

                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div>
                      <p className="text-xs text-gray-400">Order ID</p>
                      <p className="text-xs font-mono text-gray-500 dark:text-gray-400">{order._id}</p>
                    </div>
                    <div className="hidden sm:block w-px h-8 bg-gray-100 dark:bg-gray-800" />
                    <div>
                      <p className="text-xs text-gray-400">Customer</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {order.user?.name}
                        <span className="text-gray-400 font-normal"> · {order.user?.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[order.status]}`}>
                      {order.status.toUpperCase()}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                    >
                      {['pending','processing','shipped','delivered','cancelled'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4 flex flex-col gap-2">
                  {order.items.map((item) => (
                    <div key={item.product?._id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {item.product?.image && (
                          <img
                            src={item.product?.images?.[0]?.url}
                            alt=""
                            loading="lazy"
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        )}
                        <span className="text-gray-600 dark:text-gray-400">
                          {item.product?.title}
                          <span className="text-gray-400"> × {item.quantity}</span>
                        </span>
                      </div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Rs. {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-400">
                    📍 {order.shippingAddress?.street}, {order.shippingAddress?.city} · 📞 {order.shippingAddress?.phone}
                  </p>
                  <p className="font-bold text-red-500">Total: Rs. {order.totalPrice}</p>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;