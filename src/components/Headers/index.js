import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaHeart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useState } from 'react';
import './header.css';

const Header = () => {
    const { cartCount } = useCart() || { cartCount: 0 };
    const { user, logout } = useAuth() || { user: null, logout: () => {} };
    const { wishlistItems } = useWishlist() || { wishlistItems: [] };
    const wishCount = wishlistItems?.length || 0;

    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) navigate(`/products?search=${search}`);
    };

    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <header className="site-header">
            {/* Top Strip */}
            <div className="top-strip bg-blue">
                <div className="container">
                    <p className="mb-0 text-center">🚚 Free shipping on orders over ₹500 | Use code <b>QUICKMART10</b> for 10% off</p>
                </div>
            </div>

            {/* Main Header */}
            <div className="main-header">
                <div className="container">
                    <div className="header-inner">
                        {/* Logo */}
                        <div className="logo-wrap">
                            <Link to={user ? "/home" : "/"} className="logo-link">
                                <span className="logo-icon">🛒</span>
                                <span className="logo-text">Quick<span className="logo-accent">Mart</span></span>
                            </Link>
                        </div>

                        {/* Search */}
                        <form className="header-search" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit"><FaSearch /></button>
                        </form>

                        {/* Actions */}
                        <div className="header-actions">
                            <Link to="/wishlist" className="cart-btn">
                                <FaHeart />
                                {wishCount > 0 && <span className="cart-badge">{wishCount}</span>}
                                <span>Wishlist</span>
                            </Link>
                            <Link to="/cart" className="cart-btn">
                                <FaShoppingCart />
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                                <span>Cart</span>
                            </Link>

                            {user ? (
                                <div className="user-menu">
                                    <button className="user-btn"><FaUser /><span>{user.name.split(' ')[0]}</span></button>
                                    <div className="user-dropdown">
                                        <Link to="/profile">My Profile</Link>
                                        <Link to="/dashboard">My Dashboard</Link>
                                        {user?.isAdmin && <Link to="/admin/dashboard">Admin Dashboard</Link>}
                                        {user?.isAdmin && <Link to="/admin/products">Admin Products</Link>}
                                        <button onClick={handleLogout}><FaSignOutAlt /> Logout</button>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="login-btn"><FaUser /><span>Login</span></Link>
                            )}
                        </div>

                        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}><FaBars /></button>
                    </div>
                </div>
            </div>

            {/* Nav Bar */}
            <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
                <div className="container">
                    <ul>
                        <li><Link to={user ? "/home" : "/"} onClick={() => setMenuOpen(false)}>Home</Link></li>
                        <li><Link to="/products" onClick={() => setMenuOpen(false)}>All Products</Link></li>
                        <li><Link to="/products?category=Electronics" onClick={() => setMenuOpen(false)}>Electronics</Link></li>
                        <li><Link to="/products?category=Fashion" onClick={() => setMenuOpen(false)}>Fashion</Link></li>
                        <li><Link to="/products?category=Home" onClick={() => setMenuOpen(false)}>Home & Living</Link></li>
                        <li><Link to="/products?category=Sports" onClick={() => setMenuOpen(false)}>Sports</Link></li>
                        <li><Link to="/products?category=Beauty" onClick={() => setMenuOpen(false)}>Beauty</Link></li>
                        <li><Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link></li>
                        {user?.isAdmin && <li><Link to="/admin/orders" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link></li>}
                        {user?.isAdmin && <li><Link to="/admin/products" onClick={() => setMenuOpen(false)}>Products</Link></li>}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
