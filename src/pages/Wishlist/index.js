import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/ProductCard';
import toast from 'react-hot-toast';
import './wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const items = useMemo(() => wishlistItems || [], [wishlistItems]);

  if (!items.length) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <h2>Your Wishlist</h2>
          <p className="wishlist-empty">You haven't saved anything yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <h2>Your Wishlist</h2>
        <div className="wishlist-grid">
          {items.map((p) => (
            <div className="wishlist-item" key={p._id}>
              <ProductCard product={p} />
              <div className="wishlist-actions">
                <button className="btn btn-primary" onClick={() => { addToCart(p); toast.success(`🛒 ${p.name} added to cart!`); }} disabled={p.stock === 0}>
                  Add to Cart
                </button>
                <button className="btn btn-outline-danger" onClick={() => { removeFromWishlist(p._id); toast.success('❤️ Removed from wishlist'); }}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

