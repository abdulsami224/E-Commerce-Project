import { useEffect, useState } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const categories = ['', 'electronics', 'footwear', 'clothing'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await API.get('/products', { params: { search, category } });
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [search, category]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-3">
            Discover Our Collection
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Fresh styles. Great prices. Delivered to you.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === '' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No products found</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;