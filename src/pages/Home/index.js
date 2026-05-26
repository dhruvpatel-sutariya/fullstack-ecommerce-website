import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../../data/api';
import ProductCard from '../../components/ProductCard';
import Banner from '../../components/Banner';
import { FaArrowRight, FaTruck, FaShieldAlt, FaUndo, FaHeadset } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './home.css';

const categories = [
    { name: 'Electronics', icon: '💻', color: '#e3f2fd' },
    { name: 'Fashion', icon: '👗', color: '#fce4ec' },
    { name: 'Home', icon: '🏠', color: '#e8f5e9' },
    { name: 'Sports', icon: '⚽', color: '#fff3e0' },
    { name: 'Beauty', icon: '💄', color: '#f3e5f5' },
    { name: 'Books', icon: '📚', color: '#e0f7fa' },
];

const bannerSlides = [
    { title: 'Fresh Deals Every Day', subtitle: 'Up to 50% off on Electronics', bg: 'linear-gradient(135deg, #1707f3 0%, #6c63ff 100%)', btn: 'Shop Electronics', link: '/products?category=Electronics', tag: 'Hot Deals' },
    { title: 'New Fashion Arrivals', subtitle: 'Trendy styles for every occasion', bg: 'linear-gradient(135deg, #e53935 0%, #ff6f00 100%)', btn: 'Shop Fashion', link: '/products?category=Fashion', tag: 'New In' },
    { title: 'Home & Living Sale', subtitle: 'Transform your space today', bg: 'linear-gradient(135deg, #00897b 0%, #43a047 100%)', btn: 'Shop Now', link: '/products?category=Home', tag: 'Sale' },
];

const Home = () => {
    const { user } = useAuth();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) { navigate('/'); return; }
        getProducts('featured=true&limit=8').then(d => setFeaturedProducts(d.products || []));
        getProducts('sort=newest&limit=8').then(d => setNewArrivals(d.products || []));
    }, [user, navigate]);

    return (
        <div className="home-page">
            {/* Hero Banner */}
            <Banner slides={bannerSlides} />

            {/* Features Strip */}
            <section className="features-strip">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-item"><FaTruck /><div><h5>Free Shipping</h5><p>On orders over ₹500</p></div></div>
                        <div className="feature-item"><FaShieldAlt /><div><h5>Secure Payment</h5><p>100% secure transactions</p></div></div>
                        <div className="feature-item"><FaUndo /><div><h5>Easy Returns</h5><p>30-day return policy</p></div></div>
                        <div className="feature-item"><FaHeadset /><div><h5>24/7 Support</h5><p>Always here to help</p></div></div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>Shop by Category</h2>
                        <Link to="/products" className="see-all">See All <FaArrowRight /></Link>
                    </div>
                    <div className="categories-grid">
                        {categories.map(cat => (
                            <div key={cat.name} className="category-card" style={{ background: cat.color }}
                                onClick={() => navigate(`/products?category=${cat.name}`)}>
                                <span className="cat-icon">{cat.icon}</span>
                                <span className="cat-name">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section bg-light-gray">
                <div className="container">
                    <div className="section-header">
                        <h2>Featured Products</h2>
                        <Link to="/products?featured=true" className="see-all">See All <FaArrowRight /></Link>
                    </div>
                    {featuredProducts.length > 0 ? (
                        <div className="products-grid">
                            {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No featured products yet. <Link to="/products">Browse all products</Link></p>
                        </div>
                    )}
                </div>
            </section>

            {/* Promo Banner */}
            <section className="promo-banner">
                <div className="container">
                    <div className="promo-inner">
                        <div>
                            <h2>Special Offer 🎉</h2>
                            <p>Get <b>10% OFF</b> on your first order. Use code <b>QUICKMART10</b></p>
                        </div>
                        <Link to="/products" className="promo-btn">Shop Now</Link>
                    </div>
                </div>
            </section>

            {/* New Arrivals */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>New Arrivals</h2>
                        <Link to="/products" className="see-all">See All <FaArrowRight /></Link>
                    </div>
                    {newArrivals.length > 0 ? (
                        <div className="products-grid">
                            {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No products yet. Add some from the backend!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
