import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addReview } from '../../data/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FaStar, FaShoppingCart, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import './productdetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [activeImg, setActiveImg] = useState(0);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewMsg, setReviewMsg] = useState('');

    useEffect(() => {
        getProductById(id).then(setProduct);
    }, [id]);

    const handleAddToCart = () => { addToCart(product, qty); navigate('/cart'); };

    const handleReview = async (e) => {
        e.preventDefault();
        const res = await addReview(id, { rating, comment });
        setReviewMsg(res.message || res.error || 'Done');
        getProductById(id).then(setProduct);
    };

    if (!product) return <div className="loading-page">Loading...</div>;

    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;

    return (
        <div className="detail-page">
            <div className="container">
                <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft /> Back</button>

                <div className="detail-grid">
                    {/* Images */}
                    <div className="detail-images">
                        <div className="main-img">
                            <img
                            src={product.images?.[activeImg] || ''}
                            alt={product.name}
                            onError={e => { e.target.onerror = null; e.target.src = `https://placehold.co/600x420/f7f7fb/ff6b2c?text=${encodeURIComponent(product.name.split(' ').slice(0,2).join(' '))}`; }}
                        />
                            {discount && <span className="detail-discount">-{discount}%</span>}
                        </div>
                        {product.images?.length > 1 && (
                            <div className="thumb-list">
                                {product.images.map((img, i) => (
                                    <img key={i} src={img} alt="" className={activeImg === i ? 'active' : ''} onClick={() => setActiveImg(i)} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="detail-info">
                        <span className="detail-category">{product.category}</span>
                        <h1>{product.name}</h1>

                        <div className="detail-rating">
                            {[...Array(5)].map((_, i) => <FaStar key={i} className={i < Math.round(product.rating) ? 'star filled' : 'star'} />)}
                            <span>{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
                        </div>

                        <div className="detail-price">
                            <span className="price">₹{product.price?.toFixed(2)}</span>
                            {product.oldPrice && <span className="old-price">₹{product.oldPrice?.toFixed(2)}</span>}
                        </div>

                        <p className="detail-desc">{product.description}</p>

                        <div className="detail-meta">
                            <span>Brand: <b>{product.brand || 'N/A'}</b></span>
                            <span>Stock: <b className={product.stock > 0 ? 'in-stock' : 'out-stock'}>{product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}</b></span>
                        </div>

                        {product.stock > 0 && (
                            <div className="qty-row">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))}><FaMinus /></button>
                                <span>{qty}</span>
                                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}><FaPlus /></button>
                            </div>
                        )}

                        <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0}>
                            <FaShoppingCart /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>

                {/* Reviews */}
                <div className="reviews-section">
                    <h3>Customer Reviews</h3>

                    {product.reviews?.length > 0 ? (
                        <div className="reviews-list">
                            {product.reviews.map((r, i) => (
                                <div key={i} className="review-card">
                                    <div className="review-header">
                                        <b>{r.name}</b>
                                        <div style={{display:'flex', alignItems:'center', gap:10}}>
                                            <div className="review-stars">
                                                {[...Array(5)].map((_, j) => <FaStar key={j} className={j < r.rating ? 'star filled' : 'star'} />)}
                                            </div>
                                            <span style={{fontSize:11,color:'var(--text-muted)',fontWeight:600}}>{new Date(r.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <p>{r.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p className="no-reviews">No reviews yet. Be the first!</p>}

                    {user ? (
                        <form className="review-form" onSubmit={handleReview}>
                            <h4>Write a Review</h4>
                            <div className="rating-select">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <FaStar key={n}
                                        className={n <= (hoverRating || rating) ? 'star filled' : 'star'}
                                        onClick={() => setRating(n)}
                                        onMouseEnter={() => setHoverRating(n)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        style={{ cursor: 'pointer', fontSize: 26, transition: 'transform 0.1s' }} />
                                ))}
                                <span style={{fontSize:13, color:'var(--text-muted)', fontWeight:600, marginLeft:8}}>{hoverRating || rating} / 5</span>
                            </div>
                            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..." required rows={4} />
                            <button type="submit">Submit Review</button>
                            {reviewMsg && <p className="review-msg">{reviewMsg}</p>}
                        </form>
                    ) : (
                        <p className="login-to-review"><a href="/login">Login</a> to write a review.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
