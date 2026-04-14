import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { dark, setDark } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="font-heading text-2xl font-bold text-red-500 dark:text-red-400 tracking-tight">
          🛍️ ShopApp
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-300">
          {user ? (
            <>
              <Link to="/" className="hover:text-red-500 transition">Home</Link>
              <Link to="/cart" className="relative hover:text-red-500 transition">
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/my-orders" className="hover:text-red-500 transition">Orders</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-red-500 font-semibold hover:underline">Admin</Link>
              )}
              <span className="text-gray-400 dark:text-gray-500">Hi, {user.name.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-red-500 transition">Login</Link>
              <Link to="/register" className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full transition">
                Register
              </Link>
            </>
          )}

          {/* Dark Mode Toggle */}
        <button
          onClick={() => setDark(!dark)}
          className={`relative ml-2 w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
            dark ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
            dark ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
        <button
          onClick={() => setDark(!dark)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
            dark ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
            dark ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </button>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 pb-4 flex flex-col gap-3 text-sm font-medium border-t border-gray-100 dark:border-gray-700">
          {user ? (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)} className="py-2 text-white hover:text-red-500">Home</Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="py-2 text-white hover:text-red-500">Cart ({cartCount})</Link>
              <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="py-2 text-white hover:text-red-500">My Orders</Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="py-2 text-red-500 font-semibold">Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="text-left py-2 text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="py-2 hover:text-red-500">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="py-2 hover:text-red-500">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;