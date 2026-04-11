import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4">
      <p className="text-5xl">🛒</p>
      <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">Your cart is empty</h2>
      <button onClick={() => navigate('/')} className="bg-red-500 text-white px-6 py-2.5 rounded-xl hover:bg-red-600 transition">
        Shop Now
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading text-3xl font-bold text-gray-800 dark:text-white mb-8">Your Cart</h2>

        <div className="flex flex-col gap-4">
          {cart.map((item) => (
            <div key={item.product._id} className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 flex flex-col sm:flex-row items-center gap-4 border border-gray-100 dark:border-gray-800">
              <img src={item.product.image} alt={item.product.title} className="w-20 h-20 object-cover rounded-xl" />
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-semibold text-gray-800 dark:text-white">{item.product.title}</h4>
                <p className="text-red-500 font-bold">Rs. {item.product.price}</p>
              </div>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} disabled={item.quantity === 1} className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-40">−</button>
                <span className="px-4 text-gray-800 dark:text-white font-medium">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition">+</button>
              </div>
              <p className="font-bold text-gray-700 dark:text-gray-200 w-20 text-right">Rs. {item.product.price * item.quantity}</p>
              <button onClick={() => removeFromCart(item.product._id)} className="text-red-400 hover:text-red-600 text-xl transition">✕</button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Total Amount</span>
            <span className="text-2xl font-bold text-red-500">Rs. {cartTotal}</span>
          </div>
          <button onClick={() => navigate('/checkout')} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition">
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;