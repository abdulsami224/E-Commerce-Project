import { useEffect, useState } from 'react';
import API from '../../api/axios';

const statusColors = {
  pending: 'orange', processing: 'blue',
  shipped: 'purple', delivered: 'green', cancelled: 'red'
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const { data } = await API.get('/orders/all');
    setOrders(data);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, status) => {
    await API.put(`/orders/${orderId}/status`, { status });
    fetchOrders();
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2>Manage Orders</h2>
      {orders.map((order) => (
        <div key={order._id} style={styles.orderCard}>

          <div style={styles.orderHeader}>
            <div>
              <p><b>Order ID:</b> {order._id}</p>
              <p><b>Customer:</b> {order.user?.name} ({order.user?.email})</p>
              <p><b>Total:</b> Rs. {order.totalPrice}</p>
            </div>
            <div>
              <span style={{ color: statusColors[order.status], fontWeight: 'bold' }}>
                {order.status.toUpperCase()}
              </span>
              <br /><br />
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                style={styles.select}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Order Items */}
          <div style={styles.items}>
            {order.items.map((item) => (
              <div key={item.product?._id} style={styles.item}>
                <span>{item.product?.title}</span>
                <span>Qty: {item.quantity}</span>
                <span>Rs. {item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <p style={{ color: '#666', marginTop: '8px' }}>
            📦 {order.shippingAddress?.street}, {order.shippingAddress?.city} — {order.shippingAddress?.phone}
          </p>

        </div>
      ))}
    </div>
  );
};

const styles = {
  orderCard: { background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginBottom: '16px' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  select: { padding: '6px', borderRadius: '4px', border: '1px solid #ccc' },
  items: { marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '8px' },
  item: { display: 'flex', gap: '20px', padding: '4px 0', color: '#444' }
};

export default AdminOrders;