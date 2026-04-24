import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'ShopApp | Page Not Found';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">

        {/* Big 404 */}
        <div className="relative mb-6">
          <p className="font-heading text-[120px] md:text-[160px] font-bold text-gray-100 dark:text-gray-800 leading-none select-none">
            404
          </p>
        </div>

        <h1 className="font-heading text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-red-400 hover:text-red-500 transition text-sm font-medium"
          >
            ← Go Back
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition text-sm font-medium text-center"
          >
            Go to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;