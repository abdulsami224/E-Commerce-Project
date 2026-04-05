import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [productsRes, ordersRes] = await Promise.all([
        API.get('/products'),
        API.get('/orders/all')
      ]);

      const orders = ordersRes.data;
      const revenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
      const pending = orders.filter(o => o.status === 'pending').length;

      setStats({
        totalProducts: productsRes.data.length,
        totalOrders: orders.length,
        totalRevenue: revenue,
        pendingOrders: pending
      });
    };
    fetchStats();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>

      {/* Stats Cards */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Total Products</h3>
          <p style={styles.number}>{stats.totalProducts}</p>
        </div>
        <div style={styles.card}>
          <h3>Total Orders</h3>
          <p style={styles.number}>{stats.totalOrders}</p>
        </div>
        <div style={styles.card}>
          <h3>Total Revenue</h3>
          <p style={styles.number}>Rs. {stats.totalRevenue}</p>
        </div>
        <div style={{ ...styles.card, borderColor: 'orange' }}>
          <h3>Pending Orders</h3>
          <p style={{ ...styles.number, color: 'orange' }}>{stats.pendingOrders}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div style={styles.links}>
        <Link to="/admin/products" style={styles.linkBtn}>Manage Products</Link>
        <Link to="/admin/orders" style={styles.linkBtn}>Manage Orders</Link>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', margin: '24px 0' },
  card: { background: '#f9f9f9', border: '2px solid #ddd', borderRadius: '8px', padding: '20px', textAlign: 'center' },
  number: { fontSize: '32px', fontWeight: 'bold', color: '#333' },
  links: { display: 'flex', gap: '16px' },
  linkBtn: { background: '#222', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none' }
};

export default AdminDashboard;