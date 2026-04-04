import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div>
      <h2>Your cart is empty</h2>
      <button onClick={() => navigate('/')}>Shop Now</button>
    </div>
  );

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.map((item) => (
        <div key={item.product._id} className="cart-item">
          <img src={item.product.image} alt={item.product.title} />
          <div>
            <h4>{item.product.title}</h4>
            <p>Rs. {item.product.price}</p>
          </div>
          <div className="quantity-controls">
            <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
              disabled={item.quantity === 1}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
          </div>
          <p>Rs. {item.product.price * item.quantity}</p>
          <button onClick={() => removeFromCart(item.product._id)}>Remove</button>
        </div>
      ))}

      <div className="cart-summary">
        <h3>Total: Rs. {cartTotal}</h3>
        <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;