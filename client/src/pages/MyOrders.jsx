import { useEffect, useState } from 'react';
import API from '../api/axios';

const statusColors = {
  pending: 'orange',
  processing: 'blue',
  shipped: 'purple',
  delivered: 'green',
  cancelled: 'red'
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await API.get('/orders/my');
      setOrders(data);
    };
    fetch();
  }, []);

  if (orders.length === 0) return <p>No orders yet</p>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <p>Order ID: {order._id}</p>
            <span style={{ color: statusColors[order.status] }}>
              {order.status.toUpperCase()}
            </span>
          </div>
          {order.items.map((item) => (
            <div key={item.product?._id} className="order-item">
              <p>{item.product?.title}</p>
              <p>Qty: {item.quantity}</p>
              <p>Rs. {item.price * item.quantity}</p>
            </div>
          ))}
          <h4>Total: Rs. {order.totalPrice}</h4>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;