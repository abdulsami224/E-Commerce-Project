import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>🛒 ShopApp</Link>

      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/cart">Cart ({cartCount})</Link>
            <Link to="/my-orders">My Orders</Link>

            {user.role === 'admin' && (
              <Link to="/admin">Admin</Link>
            )}

            <span style={styles.name}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '12px 24px',
    background: '#222', color: '#fff'
  },
  logo: { color: '#fff', fontWeight: 'bold', fontSize: '20px', textDecoration: 'none' },
  links: { display: 'flex', gap: '16px', alignItems: 'center' },
  name: { color: '#aaa' },
  btn: { background: 'crimson', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px' }
};

export default Navbar;