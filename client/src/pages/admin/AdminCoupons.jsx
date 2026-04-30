import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, X, ChevronLeft, Tag, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';

const emptyForm = {
  code: '',
  discountType: 'percentage',
  discountValue: '',
  minOrderAmount: '',
  maxUses: '',
  expiresAt: ''
};

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    document.title = 'ShopApp | Manage Coupons';
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await API.get('/coupons');
      setCoupons(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.code || !form.discountValue) {
      toast.error('Code and discount value are required');
      return;
    }
    try {
      await API.post('/coupons', form);
      toast.success('Coupon created successfully');
      setForm(emptyForm);
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await API.put(`/coupons/${id}/toggle`);
      toast.success(`Coupon ${data.isActive ? 'activated' : 'deactivated'}`);
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to update coupon');
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-sm">Delete this coupon?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await API.delete(`/coupons/${id}`);
                toast.success('Coupon deleted');
                fetchCoupons();
              } catch {
                toast.error('Failed to delete');
              }
            }}
            className="flex-1 bg-primary-500 text-white text-xs py-1.5 rounded-lg"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-500 text-xs py-1.5 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const inputClass = "px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 transition text-sm";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-primary-400 transition text-gray-500 dark:text-gray-400">
              <ChevronLeft size={18} />
            </Link>
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-800 dark:text-white">
                Manage Coupons
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{coupons.length} coupons total</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'Add Coupon'}
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-6 mb-8">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-5">
              Create New Coupon
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="code"
                placeholder="Coupon Code (e.g. SAVE10)"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className={inputClass}
              />

              <select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="percentage">Percentage (% off)</option>
                <option value="fixed">Fixed (Rs. off)</option>
              </select>

              <input
                name="discountValue"
                type="number"
                placeholder={form.discountType === 'percentage' ? 'Discount % (e.g. 10)' : 'Discount Rs. (e.g. 100)'}
                value={form.discountValue}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="minOrderAmount"
                type="number"
                placeholder="Min Order Amount (optional)"
                value={form.minOrderAmount}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="maxUses"
                type="number"
                placeholder="Max Uses (leave empty = unlimited)"
                value={form.maxUses}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="expiresAt"
                type="datetime-local"
                value={form.expiresAt}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition text-sm"
              >
                Create Coupon
              </button>
              <button
                onClick={() => { setShowForm(false); setForm(emptyForm); }}
                className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary-400 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Coupons Table */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <Tag size={48} strokeWidth={1} />
            <p>No coupons yet. Create your first one!</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
                  <th className="px-6 py-4 text-left">Code</th>
                  <th className="px-6 py-4 text-left">Discount</th>
                  <th className="px-6 py-4 text-left">Min Order</th>
                  <th className="px-6 py-4 text-left">Uses</th>
                  <th className="px-6 py-4 text-left">Expires</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg text-xs">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary-500">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}% off`
                        : `Rs. ${coupon.discountValue} off`
                      }
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {coupon.minOrderAmount > 0 ? `Rs. ${coupon.minOrderAmount}` : '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {coupon.usedCount} / {coupon.maxUses || '∞'}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        coupon.isActive
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                          : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                      }`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggle(coupon._id)}
                          className={`p-2 rounded-lg transition ${
                            coupon.isActive
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-500 hover:bg-green-100'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          {coupon.isActive
                            ? <ToggleRight size={16} />
                            : <ToggleLeft size={16} />
                          }
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-500 hover:bg-primary-100 transition"
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
        )}
      </div>
    </div>
  );
};

export default AdminCoupons;