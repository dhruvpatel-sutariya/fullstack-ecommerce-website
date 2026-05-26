import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './productcard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { isWished, toggleWishlist } = useWishlist();

    const discount = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : null;

    return (
        <div className="product-card">
            {product.badge && <span className="product-badge">{product.badge}</span>}
            {discount && <span className="product-discount">-{discount}%</span>}

            <button
                className={`wishlist-btn ${isWished(product._id) ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
                aria-label={isWished(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                <FaHeart />
            </button>

            <Link to={`/products/${product._id}`} className="product-img-wrap">
                <img
                    src={product.images?.[0] || ''}
                    alt={product.name}
                    onError={e => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/f7f7fb/ff6b2c?text=${encodeURIComponent(product.name.split(' ').slice(0,2).join(' '))}`; }}
                />
            </Link>

            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <Link to={`/products/${product._id}`} className="product-name">{product.name}</Link>

                <div className="product-rating">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.round(product.rating) ? 'star filled' : 'star'} />
                    ))}
                    <span>({product.numReviews || 0})</span>
                </div>

                <div className="product-price-row">
                    <div className="product-prices">
                        <span className="price">₹{product.price.toFixed(2)}</span>
                        {product.oldPrice && <span className="old-price">₹{product.oldPrice.toFixed(2)}</span>}
                    </div>
                    <button className="add-cart-btn" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                        <FaShoppingCart />
                    </button>
                </div>

                {product.stock === 0 && <span className="out-of-stock">Out of Stock</span>}
            </div>
        </div>
    );
};

export default ProductCard;
