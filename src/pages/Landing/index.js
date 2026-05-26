import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './landing.css';

const Landing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/home');
    }, [user, navigate]);

    return (
        <div className="landing-page">
            <div className="landing-hero">
                <div className="landing-copy">
                    <span className="label">Welcome to QuickMart</span>
                    <h1>Your shopping destination for fashion, gadgets, books, beauty, and home essentials.</h1>
                    <p>Start with a secure account to save your cart, track orders, and access personalized dashboards.</p>
                    <div className="landing-actions">
                        <Link to="/register" className="btn btn-primary">Create Account</Link>
                        <Link to="/login" className="btn btn-outline">Already have an account?</Link>
                    </div>
                </div>
                <div className="landing-visual">
                    <div className="visual-card">
                        <h3>All-in-one Marketplace</h3>
                        <p>Explore thousands of products across categories with fast checkout.</p>
                    </div>
                    <div className="visual-tiles">
                        <div className="tile">Electronics</div>
                        <div className="tile">Fashion</div>
                        <div className="tile">Beauty</div>
                        <div className="tile">Books</div>
                    </div>
                </div>
            </div>
            <section className="landing-features">
                <div className="container">
                    <div className="feature-item">
                        <h3>Secure Sign Up</h3>
                        <p>Register quickly and start shopping with personalized dashboards.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Order Tracking</h3>
                        <p>Track every order from placement to delivery in your dashboard.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Admin Control</h3>
                        <p>Admins can approve or cancel orders and view sales metrics.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
