import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const StatCard = ({ label, value, color }) => (
  <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-6 text-center`}>
    <p className="text-sm text-gray-400 mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });

  useEffect(() => { document.title = 'ShopApp | Admin Dashboard'; }, []);

  useEffect(() => {
    const load = async () => {
      const [p, o] = await Promise.all([API.get('/products'), API.get('/orders/all')]);
      setStats({
        products: p.data.length,
        orders: o.data.length,
        revenue: o.data.reduce((a, b) => a + b.totalPrice, 0),
        pending: o.data.filter(x => x.status === 'pending').length
      });
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-3xl font-bold text-gray-800 dark:text-white mb-8">Admin Dashboard</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Products" value={stats.products} color="text-blue-500" />
          <StatCard label="Total Orders" value={stats.orders} color="text-purple-500" />
          <StatCard label="Revenue" value={`Rs. ${stats.revenue}`} color="text-green-500" />
          <StatCard label="Pending Orders" value={stats.pending} color="text-orange-500" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/admin/products" className="flex-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow p-6 hover:border-red-300 transition text-center">
            <p className="text-3xl mb-2">📦</p>
            <p className="font-semibold text-gray-700 dark:text-white">Manage Products</p>
            <p className="text-xs text-gray-400 mt-1">Add, edit, delete products</p>
          </Link>
          <Link to="/admin/orders" className="flex-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow p-6 hover:border-red-300 transition text-center">
            <p className="text-3xl mb-2">🧾</p>
            <p className="font-semibold text-gray-700 dark:text-white">Manage Orders</p>
            <p className="text-xs text-gray-400 mt-1">View and update order status</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;