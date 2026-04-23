import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, ChevronLeft, Package, Search } from 'lucide-react';
import API from '../../api/axios';
import ImageUploader from '../../components/ImageUploader';
import CategorySelect from '../../components/CategorySelect';
import Pagination from '../../components/Pagination';
import useCategories from '../../hooks/useCategories';
import toast from 'react-hot-toast';

const emptyForm = { title: '', description: '', price: '', category: '', stock: '', images: [] };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [search, setSearch] = useState('');
  const searchDebounceRef = useRef(null); 
  const LIMIT = 15;
  const { categories, fetchCategories } = useCategories();

  const fetchProducts = async (page = 1, searchVal = search) => {
    try {
      const { data } = await API.get('/products', {
        params: { page, limit: LIMIT, search: searchVal }
      });
      setProducts(data.products);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalProducts(data.totalProducts);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(1); }, []);

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1, val);
    }, 400);
  };
  
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    try {
      const productData = { ...form, images };
      if (editId) {
        await API.put(`/products/${editId}`, productData);
        toast.success('Product updated successfully');
      } else {
        await API.post('/products', productData);
        toast.success('Product added successfully');
      }
      setForm(emptyForm);
      setImages([]);
      setEditId(null);
      setShowForm(false);
      fetchProducts(currentPage);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    }
  };

// In AdminProducts.jsx — replace handleDelete with this
  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-sm">Delete this product?</p>
        <p className="text-xs text-gray-400">This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await API.delete(`/products/${id}`);
                toast.success('Product deleted');
                fetchProducts(currentPage);
              } catch (err) {
                toast.error('Failed to delete product');
              }
            }}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 rounded-lg transition"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs py-1.5 rounded-lg hover:border-red-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity }); // stays until user clicks
  };

  const handleEdit = (product) => {
    setForm({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
    setImages(product.images || []);  
    setEditId(product._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm(emptyForm);
    setImages([]);
    setEditId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-red-400 transition text-gray-500 dark:text-gray-400"
              >
                <ChevronLeft size={18} />
              </Link>
              <div>
                <h2 className="font-heading text-2xl font-bold text-gray-800 dark:text-white">
                  Manage Products
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">{totalProducts} products total</p>
              </div>
            </div>
            <button
              onClick={() => { setShowForm(!showForm); setForm(emptyForm); setEditId(null); }}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? 'Cancel' : 'Add Product'}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search products by name..."
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition text-sm"
            />
          </div>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-6 mb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-800 dark:text-white text-lg">
                {editId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={handleCancel} className="text-gray-400 hover:text-red-500 transition">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'title', placeholder: 'Product Title', type: 'text' },
                { name: 'price', placeholder: 'Price (Rs.)', type: 'number' },
                { name: 'stock', placeholder: 'Stock Quantity', type: 'number' },
              ].map((field) => (
                <input
                  key={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition text-sm"
                />
              ))}

              <div className="sm:col-span-2">
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block font-medium">
                  Category
                </label>
                <CategorySelect
                  value={form.category}
                  onChange={(val) => setForm({ ...form, category: val })}
                  categories={categories}
                />
              </div>
              <ImageUploader images={images} setImages={setImages} />
              <textarea
                name="description"
                placeholder="Product Description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition text-sm sm:col-span-2 resize-none"
              />
            </div>

         

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition text-sm"
              >
                {editId ? 'Update Product' : 'Save Product'}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-red-400 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <Package size={48} strokeWidth={1} />
            <p>No products yet. Add your first one!</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
                    <th className="px-6 py-4 text-left">Product</th>
                    <th className="px-6 py-4 text-left">Category</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-left">Stock</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0]?.url || 'https://placehold.co/80x80?text=No+Image'}
                            alt={p.title}
                            loading="lazy"
                            className="w-10 h-10 rounded-lg object-cover border border-gray-100 dark:border-gray-700"
                          />
                          <span className="font-medium text-gray-800 dark:text-white line-clamp-1">{p.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-red-100 dark:bg-red-900/30 text-red-500 text-xs px-2 py-0.5 rounded-full">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                        Rs. {p.price}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.stock > 0 ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-500 dark:bg-red-900/30'}`}>
                          {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(p)}
                            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-3">
              {products.map((p) => (
                <div key={p._id} className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
                  <img
                    src={p.images?.[0]?.url || 'https://placehold.co/80x80?text=No+Image'}
                    alt={p.title}
                    loading="lazy"
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-1">{p.title}</p>
                    <p className="text-red-500 font-bold text-sm">Rs. {p.price}</p>
                    <span className="text-xs text-gray-400">{p.category} · {p.stock} in stock</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => handleEdit(p)} className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex items-center justify-between mt-6">
          <p className="text-xs text-gray-400">
            Showing{' '}
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              {(currentPage - 1) * LIMIT + 1}–{Math.min(currentPage * LIMIT, totalProducts)}
            </span>{' '}
            of{' '}
            <span className="text-gray-600 dark:text-gray-300 font-medium">{totalProducts}</span>{' '}
            products
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => fetchProducts(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;