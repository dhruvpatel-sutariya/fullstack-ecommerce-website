import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCategories, getProducts } from '../../data/api';
import ProductCard from '../../components/ProductCard';
import { FaFilter, FaTimes } from 'react-icons/fa';
import './productlisting.css';

const sortOptions = [
  { label: 'Newest', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
];

const ProductListing = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const params = new URLSearchParams(location.search);
  const category = params.get('category') || '';
  const search = params.get('search') || '';
  const sort = params.get('sort') || '';

  useEffect(() => {
    getCategories().then((cats) => setCategories(Array.isArray(cats) ? cats : []));
  }, []);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams({
      ...(category && { category }),
      ...(search && { search }),
      ...(sort && { sort }),
      page,
      limit: 12,
    }).toString();

    getProducts(q).then((d) => {
      setProducts(d.products || []);
      setTotal(d.total || 0);
      setLoading(false);
    });
  }, [location.search, page]);

  const setFilter = (key, val) => {
    const p = new URLSearchParams(location.search);
    val ? p.set(key, val) : p.delete(key);
    setPage(1);
    navigate(`/products?${p.toString()}`);
  };

  return (
    <div className="listing-page">
      <div className="container">
        <div className="listing-header">
          <h2>
            {search ? `Results for "${search}"` : category || 'All Products'} <span>({total})</span>
          </h2>
          <div className="listing-controls">
            <select
              value={sort}
              onChange={(e) => setFilter('sort', e.target.value)}
              className="sort-select"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button className="filter-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FaFilter /> Filters
            </button>
          </div>
        </div>

        <div className="listing-body">
          {/* Sidebar */}
          <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h4>Filters</h4>
              <button onClick={() => setSidebarOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="filter-group">
              <h5>Category</h5>
              <ul>
                <li className={!category ? 'active' : ''} onClick={() => setFilter('category', '')}>
                  All
                </li>
                {(categories || []).map((c) => (
                  <li
                    key={c}
                    className={category === c ? 'active' : ''}
                    onClick={() => setFilter('category', c)}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products */}
          <div className="listing-products">
            {loading ? (
              <div className="loading-grid">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="skeleton-card" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="products-grid">
                  {products.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>

                {total > 12 && (
                  <div className="pagination">
                    {[...Array(Math.ceil(total / 12))].map((_, i) => (
                      <button
                        key={i}
                        className={page === i + 1 ? 'active' : ''}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try a different category or search term.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;

