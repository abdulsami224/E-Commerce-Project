import { useEffect, useState } from 'react';
import API from '../../api/axios';

const emptyForm = { title: '', description: '', price: '', category: '', stock: '', image: '' };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    const { data } = await API.get('/products');
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await API.put(`/products/${editId}`, form);
      } else {
        await API.post('/products', form);
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleEdit = (product) => {
    setForm({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image
    });
    setEditId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Manage Products</h2>
        <button style={styles.addBtn} onClick={() => { setShowForm(!showForm); setForm(emptyForm); setEditId(null); }}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div style={styles.form}>
          <h3>{editId ? 'Edit Product' : 'Add New Product'}</h3>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} style={styles.input} />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} style={styles.input} />
          <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} style={styles.input} />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} style={styles.input} />
          <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} style={styles.input} />
          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} style={styles.input} />
          <button onClick={handleSubmit} style={styles.saveBtn}>
            {editId ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      )}

      {/* Products Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Image</th><th>Title</th><th>Category</th>
            <th>Price</th><th>Stock</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td><img src={p.image} alt={p.title} width="50" height="50" style={{ objectFit: 'cover' }} /></td>
              <td>{p.title}</td>
              <td>{p.category}</td>
              <td>Rs. {p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => handleEdit(p)} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(p._id)} style={styles.deleteBtn}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: { padding: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  addBtn: { background: '#222', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  form: { background: '#f5f5f5', padding: '20px', borderRadius: '8px', margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
  saveBtn: { background: 'green', color: '#fff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  editBtn: { background: 'steelblue', color: '#fff', border: 'none', padding: '4px 10px', marginRight: '6px', cursor: 'pointer', borderRadius: '4px' },
  deleteBtn: { background: 'crimson', color: '#fff', border: 'none', padding: '4px 10px', cursor: 'pointer', borderRadius: '4px' }
};

export default AdminProducts;