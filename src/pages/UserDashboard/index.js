import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyOrders } from '../../data/api';
import { useAuth } from '../../context/AuthContext';
import './userdashboard.css';

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/'); return; }
        getMyOrders().then(data => { setOrders(data || []); setLoading(false); });
    }, [user, navigate]);

    const summary = useMemo(() => {
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        const approved = orders.filter(o => o.status === 'approved').length;
        const cancelled = orders.filter(o => o.status === 'cancelled').length;
        const pending = orders.filter(o => o.status === 'pending').length;
        return { totalOrders, totalSpent, approved, cancelled, pending };
    }, [orders]);

    if (!user) return null;

    return (
        <div className="user-dashboard-page">
            <div className="container">
                <header className="dashboard-hero">
                    <div>
                        <p>Welcome back,</p>
                        <h1>{user.name}</h1>
                        <p className="dashboard-subtitle">Your shopping dashboard with order summaries, status updates, and quick access to products.</p>
                    </div>
                    <Link to="/products" className="btn btn-primary">Shop New Products</Link>
                </header>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <span>Total Orders</span>
                        <strong>{summary.totalOrders}</strong>
                    </div>
                    <div className="dashboard-card">
                        <span>Total Spent</span>
                        <strong>₹{summary.totalSpent.toFixed(2)}</strong>
                    </div>
                    <div className="dashboard-card">
                        <span>Approved Orders</span>
                        <strong>{summary.approved}</strong>
                    </div>
                    <div className="dashboard-card">
                        <span>Pending Orders</span>
                        <strong>{summary.pending}</strong>
                    </div>
                    <div className="dashboard-card">
                        <span>Cancelled Orders</span>
                        <strong>{summary.cancelled}</strong>
                    </div>
                </div>

                <section className="recent-orders-section">
                    <div className="section-header">
                        <h2>Recent Orders</h2>
                        <Link to="/orders" className="link-btn">View all orders</Link>
                    </div>
                    {loading ? (
                        <div className="loader">Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="empty-state">
                            <p>No orders yet. Start shopping to place your first order.</p>
                            <Link to="/products" className="shop-link">Browse Products</Link>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.slice(0, 4).map(order => (
                                <div key={order._id} className="order-card">
                                    <div className="order-row">
                                        <div><strong>Order</strong></div>
                                        <div>#{order._id.slice(-6).toUpperCase()}</div>
                                    </div>
                                    <div className="order-row">
                                        <div><strong>Date</strong></div>
                                        <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="order-row">
                                        <div><strong>Amount</strong></div>
                                        <div>₹{order.totalPrice.toFixed(2)}</div>
                                    </div>
                                    <div className="order-row">
                                        <div><strong>Status</strong></div>
                                        <div className={`status-pill ${order.status}`}>{order.status}</div>
                                    </div>
                                    <Link to={`/orders/${order._id}`} className="details-link">View details</Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default UserDashboard;
