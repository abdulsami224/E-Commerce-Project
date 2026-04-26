import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const StatCard = ({ label, value, color, sub }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-6">
    <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    projected: 0,
    pending: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'ShopApp | Admin Dashboard';

    const load = async () => {
      try {
        const [p, o] = await Promise.all([
          API.get('/products'),
          API.get('/orders/all')
        ]);

        const orders = o.data;

        // ✅ Real revenue — delivered only
        const revenue = orders
          .filter(o => o.status === 'delivered')
          .reduce((acc, o) => acc + o.totalPrice, 0);

        // ⚠️ Projected — processing + shipped
        const projected = orders
          .filter(o => o.status === 'processing' || o.status === 'shipped')
          .reduce((acc, o) => acc + o.totalPrice, 0);

        const pending   = orders.filter(o => o.status === 'pending').length;
        const delivered = orders.filter(o => o.status === 'delivered').length;
        const cancelled = orders.filter(o => o.status === 'cancelled').length;

        setStats({
          products: p.data.totalProducts,
          orders: orders.length,
          revenue,
          projected,
          pending,
          delivered,
          cancelled,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h2 className="font-heading text-3xl font-bold text-gray-800 dark:text-white">
            Admin Dashboard
          </h2>
          <p className="text-sm text-gray-400 mt-1">Overview of your store performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total Products"
            value={stats.products}
            color="text-blue-500"
            sub="in your store"
          />
          <StatCard
            label="Total Orders"
            value={stats.orders}
            color="text-purple-500"
            sub={`${stats.cancelled} cancelled`}
          />
          <StatCard
            label="Delivered Orders"
            value={stats.delivered}
            color="text-green-500"
            sub="successfully delivered"
          />

          {/* Revenue — full width on mobile */}
          <div className="col-span-2 md:col-span-1 bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-6">
            <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">
              Total Revenue
            </p>
            <p className="text-2xl font-bold text-green-500">
              Rs. {stats.revenue.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              from delivered orders only
            </p>
          </div>

          {/* Projected Revenue */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-6">
            <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">
              Projected Revenue
            </p>
            <p className="text-2xl font-bold text-orange-500">
              Rs. {stats.projected.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              processing + shipped orders
            </p>
          </div>

          {/* Pending Orders */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-6">
            <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">
              Pending Orders
            </p>
            <p className="text-2xl font-bold text-yellow-500">
              {stats.pending}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              waiting to be processed
            </p>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-6 mb-8">
          <p className="text-sm font-semibold text-gray-700 dark:text-white mb-4">
            Order Status Breakdown
          </p>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Pending',    count: stats.pending,                                                              color: 'bg-yellow-400', text: 'text-yellow-600' },
              { label: 'Processing', count: stats.orders - stats.pending - stats.delivered - stats.cancelled,           color: 'bg-blue-400',   text: 'text-blue-600' },
              { label: 'Delivered',  count: stats.delivered,                                                            color: 'bg-green-400',  text: 'text-green-600' },
              { label: 'Cancelled',  count: stats.cancelled,                                                            color: 'bg-red-400',    text: 'text-red-500' },
            ].map(({ label, count, color, text }) => {
              const percent = stats.orders > 0
                ? Math.round((count / stats.orders) * 100)
                : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`font-medium ${text}`}>{label}</span>
                    <span className="text-gray-400">{count} orders · {percent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className={`${color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/admin/products"
            className="flex-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow p-6 hover:border-red-300 dark:hover:border-red-800 transition group"
          >
            <p className="text-3xl mb-2">📦</p>
            <p className="font-semibold text-gray-700 dark:text-white group-hover:text-red-500 transition">
              Manage Products
            </p>
            <p className="text-xs text-gray-400 mt-1">Add, edit, delete products</p>
          </Link>
          <Link
            to="/admin/orders"
            className="flex-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow p-6 hover:border-red-300 dark:hover:border-red-800 transition group"
          >
            <p className="text-3xl mb-2">🧾</p>
            <p className="font-semibold text-gray-700 dark:text-white group-hover:text-red-500 transition">
              Manage Orders
            </p>
            <p className="text-xs text-gray-400 mt-1">View and update order status</p>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;