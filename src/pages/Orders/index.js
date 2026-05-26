import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyOrders } from '../../data/api';
import { useAuth } from '../../context/AuthContext';
import './orders.css';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        getMyOrders().then(data => {
            setOrders(data || []);
            setLoading(false);
        });
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div className="orders-page">
            <div className="container">
                <h2>My Orders</h2>
                {loading ? (
                    <p>Loading your orders...</p>
                ) : orders.length === 0 ? (
                    <div className="empty-orders">
                        <p>You have not placed any orders yet.</p>
                        <Link to="/products" className="shop-link">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="orders-grid">
                        {orders.map(order => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`order-status ${order.status}`}>{order.status}</span>
                                </div>
                                <div className="order-summary">
                                    <p><strong>Items:</strong> {order.orderItems.length}</p>
                                    <p><strong>Total:</strong> ₹{order.totalPrice.toFixed(2)}</p>
                                    {order.statusMessage ? (
                                        <p className="order-msg">{order.statusMessage}</p>
                                    ) : null}
                                </div>
                                <Link to={`/orders/${order._id}`} className="details-btn">View Details</Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
