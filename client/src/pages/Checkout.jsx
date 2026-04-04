import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: '', city: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    setLoading(true);
    try {
      await API.post('/orders', { shippingAddress: address });
      clearCart();
      alert('Order placed successfully!');
      navigate('/my-orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="shipping-form">
        <h3>Shipping Address</h3>
        <input name="street" placeholder="Street Address" onChange={handleChange} />
        <input name="city" placeholder="City" onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} />
      </div>
      <div className="order-summary">
        <h3>Total: Rs. {cartTotal}</h3>
        <button onClick={handleOrder} disabled={loading}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;