import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import './footer.css';

const Footer = () => (
    <footer className="site-footer">
        <div className="footer-top">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h3>QuickMart</h3>
                        <p>Your one-stop shop for everything you need. Quality products at the best prices, delivered fast.</p>
                        <div className="social-links">
                            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
                            <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube /></a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">All Products</Link></li>
                            <li><Link to="/cart">Cart</Link></li>
                            <li><Link to="/profile">My Account</Link></li>
                            <li><Link to="/orders">My Orders</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Categories</h4>
                        <ul>
                            <li><Link to="/products?category=Electronics">Electronics</Link></li>
                            <li><Link to="/products?category=Fashion">Fashion</Link></li>
                            <li><Link to="/products?category=Home">Home & Living</Link></li>
                            <li><Link to="/products?category=Sports">Sports</Link></li>
                            <li><Link to="/products?category=Beauty">Beauty</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Contact Us</h4>
                        <ul className="contact-list">
                            <li><FaMapMarkerAlt /> sector7, gandhinagar, India</li>
                            <li><FaPhone /> +91 9016541906</li>
                            <li><FaEnvelope /> sutariyadhruv18@gmail.com</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <div className="container">
                <p>© 2024 QuickMart. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

export default Footer;
