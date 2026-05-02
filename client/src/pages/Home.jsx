import { useEffect, useState, useRef } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import RecentlyViewed from '../components/RecentlyViewed';
import PriceRangeSlider from '../components/PriceRangeSlider';
import useCategories from '../hooks/useCategories';
import { SlidersHorizontal, X } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [globalPriceRange, setGlobalPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const { categories } = useCategories();
  const searchDebounceRef = useRef(null);

  useEffect(() => {
    document.title = 'ShopApp | Shop';
  }, []);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      // scroll to top on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const { data } = await API.get('/products', {
        params: {
          search, category, page, limit: 20, sort,
          minPrice: priceRange[0],
          maxPrice: priceRange[1]
        }
      });

      setProducts(data.products);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalProducts(data.totalProducts);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // reset to page 1 when search or category changes
    useEffect(() => {
      setCurrentPage(1);
      fetchProducts(1);
    }, [search, category, sort, priceRange]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts(page);
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setSort('newest');
    setPriceRange(globalPriceRange);
  };

  const isFiltered =
    category !== '' ||
    sort !== 'newest' ||
    priceRange[0] !== globalPriceRange[0] ||
    priceRange[1] !== globalPriceRange[1];

  useEffect(() => {

    const fetchPriceRange = async () => {
      try {
        const { data } = await API.get('/products/price-range');
        const min = Math.floor(data.minPrice);
        const max = Math.ceil(data.maxPrice);
        setGlobalPriceRange([min, max]);
        setPriceRange([min, max]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPriceRange();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-3">
            Discover Our Collection
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Fresh styles. Great prices. Delivered to you.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">

          {/* Top row — search + mobile filter toggle */}
          <div className="flex gap-3 mb-3">
            <input
              placeholder="Search products..."
              onChange={(e) => {
                const value = e.target.value;
                clearTimeout(searchDebounceRef.current);
                searchDebounceRef.current = setTimeout(() => {
                  setSearch(value);
                }, 400);
              }}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition text-sm"
            />

            {/* Mobile: toggle filters button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-sm transition hover:border-primary-400"
            >
              <SlidersHorizontal size={15} />
              Filters
              {isFiltered && (
                <span className="w-2 h-2 bg-primary-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Filter controls — always visible on desktop, toggle on mobile */}
          <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-3`}>

            {/* Category */}
            <div className="relative md:w-48">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 transition cursor-pointer text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Sort */}
            <div className="relative md:w-52">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 transition cursor-pointer text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
              <PriceRangeSlider
                min={globalPriceRange[0]}
                max={globalPriceRange[1]}
                value={priceRange}
                onChange={setPriceRange}
              />
            </div>

            {/* Reset button — only shows when filters active */}
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-primary-400 hover:text-primary-500 transition text-sm font-medium whitespace-nowrap"
              >
                <X size={14} />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(20)].map((_, i) => (
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

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <RecentlyViewed />

      </div>
    </div>
  );
};

export default Home;