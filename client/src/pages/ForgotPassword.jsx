import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ChevronLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = 'ShopApp | Forgot Password';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      await API.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Back to login */}
        <Link
          to="/login"
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 mb-6 transition"
        >
          <ChevronLeft size={16} /> Back to Login
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">

          {!sent ? (
            <>
              {/* Icon */}
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-5">
                <Mail size={24} className="text-red-500" />
              </div>

              <h2 className="font-heading text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Forgot Password?
              </h2>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                No worries! Enter your email and we'll send you a reset link. Link expires in 15 minutes.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            // Success state
            <>
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-5">
                <CheckCircle size={24} className="text-green-500" />
              </div>

              <h2 className="font-heading text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Check your email
              </h2>
              <p className="text-gray-400 text-sm mb-2 leading-relaxed">
                We sent a reset link to
              </p>
              <p className="text-red-500 font-semibold text-sm mb-6 break-all">
                {email}
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Didn't receive the email? Check your spam folder. The link expires in <span className="text-red-400 font-medium">15 minutes</span>.
                </p>
              </div>

              <button
                onClick={() => setSent(false)}
                className="w-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 py-3 rounded-xl hover:border-red-400 hover:text-red-500 transition text-sm font-medium"
              >
                Try different email
              </button>
            </>
          )}

          <p className="text-center text-sm text-gray-400 mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-red-500 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;