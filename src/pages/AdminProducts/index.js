import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadImage } from '../../data/api';
import './adminproducts.css';

const defaultForm = {
  name: '',
  description: '',
  price: '',
  oldPrice: '',
  category: '',
  subCategory: '',
  brand: '',
  stock: '',
  images: '',
  badge: '',
  isFeatured: false,
};

const parseImages = (value) => {
  if (!value) return [];
  // Accept comma-separated URLs
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

const AdminProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState('');
  const [savingId, setSavingId] = useState('');

  const [query, setQuery] = useState('');

  // Create/Update form
  const [mode, setMode] = useState('create'); // create | edit
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const formRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.category, p.brand, p._id]
        .filter(Boolean)
        .some((x) => String(x).toLowerCase().includes(q))
    );
  }, [products, query]);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
      return;
    }

    setLoading(true);
    // Fetch first page with bigger limit for admin convenience
    getProducts('limit=200').then((d) => {
      setProducts(d.products || []);
      setLoading(false);
    });
  }, [user, navigate]);

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    const res = await uploadImage(formData);
    setUploading(false);
    if (res.url) {
      setForm(prev => ({ ...prev, images: prev.images ? prev.images + ', ' + res.url : res.url }));
      setMessage('Image uploaded!');
    } else {
      setMessage(res.message || 'Upload failed');
    }
  };

  const resetForm = () => {
    setMode('create');
    setEditingId(null);
    setForm(defaultForm);
    setMessage('');
  };

  const startEdit = (p) => {
    setMode('edit');
    setEditingId(p._id);
    setForm({
      name: p.name || '',
      description: p.description || '',
      price: p.price ?? '',
      oldPrice: p.oldPrice ?? '',
      category: p.category || '',
      subCategory: p.subCategory || '',
      brand: p.brand || '',
      stock: p.stock ?? '',
      images: (p.images || []).join(', '),
      badge: p.badge || '',
      isFeatured: !!p.isFeatured,
    });
    setMessage('');
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const buildPayload = () => {
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      oldPrice: form.oldPrice === '' ? null : Number(form.oldPrice),
      category: form.category.trim(),
      subCategory: form.subCategory.trim(),
      brand: form.brand.trim(),
      stock: Number(form.stock),
      images: parseImages(form.images),
      badge: form.badge ? form.badge.trim() : null,
      isFeatured: !!form.isFeatured,
    };

    // Keep oldPrice null instead of NaN
    if (payload.oldPrice !== null && Number.isNaN(payload.oldPrice)) payload.oldPrice = null;

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'create') {
      setSavingId('new');
      setMessage('');
      const payload = buildPayload();
      const res = await createProduct(payload);
      setSavingId('');
      if (res && res._id) {
        setProducts((prev) => [res, ...prev]);
        setMessage('Product created successfully');
        resetForm();
      } else {
        setMessage(res?.message || 'Unable to create product');
      }
      return;
    }

    setSavingId(editingId);
    setMessage('');
    const payload = buildPayload();
    const res = await updateProduct(editingId, payload);
    setSavingId('');
    if (res && res._id) {
      setProducts((prev) => prev.map((p) => (p._id === editingId ? res : p)));
      setMessage('Product updated successfully');
      resetForm();
    } else {
      setMessage(res?.message || 'Unable to update product');
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this product?');
    if (!ok) return;
    setSavingId(id);
    setMessage('');
    const res = await deleteProduct(id);
    setSavingId('');
    if (res && res.message) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setMessage(res.message);
    } else {
      setMessage(res?.message || 'Unable to delete product');
    }
  };

  return (
    <div className="admin-products-page">
      <div className="container">
        <div className="admin-products-header">
          <div>
            <h2>Admin Products</h2>
            <p className="admin-note">Create, edit, and delete products.</p>
          </div>
          <div className="admin-products-actions">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, brand, category..."
            />
            <button
              className="btn btn-secondary"
              onClick={resetForm}
              type="button"
            >
              New Product
            </button>
          </div>
        </div>

        {message && <div className="admin-message">{message}</div>}

        <div className="products-admin-table">
          <div className="products-admin-head">
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Featured</span>
            <span>Actions</span>
          </div>

          {loading ? (
            <div className="loading-state">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">No products found.</div>
          ) : (
            filtered.map((p) => (
              <div key={p._id} className="products-admin-row">
                <span>
                  <img className="product-thumb" src={p.images?.[0] || 'https://via.placeholder.com/120'} alt={p.name} />
                  <span style={{ marginLeft: 10, fontWeight: 700 }}>{p.name}</span>
                </span>
                <span>{p.category || '—'}</span>
                <span>₹{Number(p.price || 0).toFixed(2)}</span>
                <span>{p.stock ?? 0}</span>
                <span>
                  <span className={`status-pill ${p.isFeatured ? 'pill-true' : 'pill-false'}`}>
                    {p.isFeatured ? 'Yes' : 'No'}
                  </span>
                </span>
                <span style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => startEdit(p)}
                    disabled={savingId !== ''}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => handleDelete(p._id)}
                    disabled={savingId === p._id}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))
          )}
        </div>

        <form ref={formRef} className="inline-form" onSubmit={handleSubmit} style={{ marginTop: 18 }}>
          <h3 style={{ gridColumn: '1/-1', margin: 0 }}>
            {mode === 'create' ? 'Create Product' : 'Edit Product'}
          </h3>

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />

          <input
            placeholder="Brand"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />
          <input
            placeholder="Sub Category"
            value={form.subCategory}
            onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Old Price (optional)"
            value={form.oldPrice}
            onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
          />

          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
          <input
            placeholder="Badge (optional)"
            value={form.badge}
            onChange={(e) => setForm({ ...form, badge: e.target.value })}
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <input
            placeholder="Images (comma-separated URLs)"
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
          />
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <label className="upload-btn">
              {uploading ? 'Uploading...' : '📁 Upload Image from PC'}
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{display:'none'}} />
            </label>
          </div>
          <div className="image-hint">Upload image from PC or paste URL above.</div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
            />
            Featured product
          </label>

          <div className="admin-form-actions">
            <button className="btn btn-primary" type="submit" disabled={savingId !== ''}>
              {savingId ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
            </button>
            <button className="btn btn-secondary" type="button" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProducts;

