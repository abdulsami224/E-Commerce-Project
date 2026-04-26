import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    document.title = 'ShopApp | Reset Password';
    if (!token) navigate('/forgot-password');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password || !form.confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await API.put(`/auth/reset-password/${token}`, {
        password: form.password
      });
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed — link may have expired');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition text-sm";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">

        {!done ? (
          <>
            {/* Icon */}
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-5">
              <Lock size={24} className="text-red-500" />
            </div>

            <h2 className="font-heading text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Set New Password
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Must be at least 6 characters.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  New Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`${inputClass} pl-10 pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className={`${inputClass} pl-10 pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Match indicator */}
                {form.confirmPassword && (
                  <p className={`text-xs px-1 ${
                    form.password === form.confirmPassword
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}>
                    {form.password === form.confirmPassword
                      ? '✓ Passwords match'
                      : '✗ Passwords do not match'
                    }
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </>
        ) : (
          // Success state
          <>
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-5">
              <CheckCircle size={28} className="text-green-500" />
            </div>

            <h2 className="font-heading text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Password Reset!
            </h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Your password has been successfully reset. You can now login with your new password.
            </p>

            <Link
              to="/login"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center"
            >
              Go to Login
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;