import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../../data/api';
import { useAuth } from '../../context/AuthContext';
import './orderdetail.css';

const OrderDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        getOrderById(id).then(data => { setOrder(data); setLoading(false); });
    }, [id, user, navigate]);

    if (!user) return null;
    if (loading) return <div className="order-detail-page"><p>Loading order details...</p></div>;
    if (!order?._id) return <div className="order-detail-page"><p>Order not found.</p></div>;

    return (
        <div className="order-detail-page">
            <div className="container">
                <button className="back-link" onClick={() => navigate(-1)}>Back to orders</button>
                <div className="order-detail-card">
                    <h2>Order #{order._id.slice(-6).toUpperCase()}</h2>
                    <div className="order-meta">
                        <div>
                            <h4>Status</h4>
                            <p className={`status-badge ${order.status}`}>{order.status}</p>
                            {order.statusMessage ? (
                                <p className="order-status-message">{order.statusMessage}</p>
                            ) : null}
                        </div>
                        <div>
                            <h4>Placed</h4>
                            <p>{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <h4>Total</h4>
                            <p>₹{order.totalPrice.toFixed(2)}</p>
                        </div>
                    </div>

                    <section className="shipping-info">
                        <h3>Shipping Address</h3>
                        <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
                    </section>

                    <section className="shipping-info">
                        <h3>Order Approved By</h3>
                        <p>{order.approvedBy ? `${order.approvedBy.name} (${order.approvedBy.email})` : 'No approver yet — order is still pending'}</p>
                    </section>

                    <section className="items-list">
                        <h3>Items</h3>
                        {order.orderItems.map(item => (
                            <div key={item.product} className="order-item">
                                <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} />
                                <div>
                                    <h4>{item.name}</h4>
                                    <p>Qty: {item.quantity}</p>
                                </div>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
