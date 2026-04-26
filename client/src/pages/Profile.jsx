import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ShoppingBag, CheckCircle, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    document.title = 'ShopApp | My Profile';
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/my');
      setOrders(data);
    } catch (err) {
      console.log(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!profileForm.name || !profileForm.email) {
      toast.error('Name and email are required');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.put('/auth/profile', profileForm);
      updateUser(data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.put('/auth/profile', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      updateUser(data);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  const statusStyles = {
    pending:    'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    shipped:    'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    delivered:  'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    cancelled:  'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400',
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition text-sm";

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'orders', label: 'Order History', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 mb-6 transition"
        >
          <ChevronLeft size={16} /> Back
        </button>

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-6 mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-md shadow-red-200 dark:shadow-red-900/40 flex-shrink-0">
              <span className="text-white font-heading font-bold text-2xl">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-800 dark:text-white">
                {user?.name}
              </h1>
              <p className="text-sm text-gray-400">{user?.email}</p>
              {user?.role === 'admin' && (
                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-500 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
                  Admin
                </span>
              )}
            </div>
            {/* Stats */}
            <div className="ml-auto text-right hidden sm:block">
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{orders.length}</p>
              <p className="text-xs text-gray-400">Total Orders</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-1.5 mb-6 shadow">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-6">

          {/* Profile Info Tab */}
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-5">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Personal Information
              </h3>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className={`${inputClass} pl-10`}
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className={`${inputClass} pl-10`}
                    placeholder="Your email"
                  />
                </div>
              </div>

              <button
                onClick={handleProfileUpdate}
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><CheckCircle size={16} /> Save Changes</>
                )}
              </button>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="flex flex-col gap-5">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Change Password
              </h3>

              {/* Current Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Current Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className={`${inputClass} pl-10 pr-10`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
                  >
                    {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  New Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className={`${inputClass} pl-10 pr-10`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
                  >
                    {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className={`${inputClass} pl-10`}
                    placeholder="Confirm new password"
                  />
                </div>
                {/* Match indicator */}
                {passwordForm.confirmPassword && (
                  <p className={`text-xs px-1 ${
                    passwordForm.newPassword === passwordForm.confirmPassword
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}>
                    {passwordForm.newPassword === passwordForm.confirmPassword
                      ? '✓ Passwords match'
                      : '✗ Passwords do not match'
                    }
                  </p>
                )}
              </div>

              <button
                onClick={handlePasswordUpdate}
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><Lock size={16} /> Update Password</>
                )}
              </button>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Order History
                <span className="text-sm font-normal text-gray-400 ml-2">
                  ({orders.length} orders)
                </span>
              </h3>

              {ordersLoading ? (
                <div className="flex flex-col gap-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-4xl mb-3">📦</p>
                  <p className="text-gray-400 text-sm">No orders yet</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order._id}
                    onClick={() => navigate(`/order-confirmation/${order._id}`)}
                    className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 hover:border-red-200 dark:hover:border-red-900 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-mono text-gray-400">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyles[order.status]}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </p>
                      <p className="font-bold text-red-500 text-sm">
                        Rs. {order.totalPrice}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;