import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOrders, updateOrderStatus } from '../../data/api';
import './adminorders.css';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState('');
    const [message, setMessage] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');

    const navigate = useNavigate();
    useEffect(() => {
        if (!user || !user.isAdmin) { navigate('/login'); return; }
        getOrders().then(data => { setOrders(data || []); setLoading(false); });
    }, [user, navigate]);

    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const query = search.trim().toLowerCase();
        const matchesSearch = !query ||
            order._id.toLowerCase().includes(query) ||
            order.user?.name.toLowerCase().includes(query) ||
            order.user?.email.toLowerCase().includes(query);
        return matchesStatus && matchesSearch;
    });

    const handleStatusChange = async (orderId, status) => {
        setSaving(orderId);
        setMessage('');
        try {
            const res = await updateOrderStatus(orderId, status);
            if (res && res._id) {
                setOrders(prev => prev.map(o => o._id === orderId ? res : o));
                setMessage(`Order ${orderId.slice(-6).toUpperCase()} updated to ${status}`);
            } else {
                setMessage(res?.message || 'Unable to update status');
            }
        } catch {
            setMessage('Network error. Please try again.');
        }
        setSaving('');
    };

    return (
        <div className="admin-orders-page">
            <div className="container">
                <h2>Admin Order Dashboard</h2>
                <p className="admin-note">Approve and update order status for customer purchases.</p>
                <div className="admin-filters">
                    <div className="filter-group">
                        <label htmlFor="status-filter">Status</label>
                        <select id="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="all">All</option>
                            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </div>
                    <div className="filter-group search-group">
                        <label htmlFor="order-search">Search</label>
                        <input
                            id="order-search"
                            type="text"
                            placeholder="Order ID, name, or email"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                {message && <div className="admin-message">{message}</div>}
                {loading ? (
                    <div className="loading-text">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">No orders found.</div>
                ) : (
                    <div className="admin-orders-grid">
                        {filteredOrders.map(order => {
                            const finalStatus = ['approved', 'cancelled', 'delivered'].includes(order.status);
                            return (
                                <div key={order._id} className="admin-order-card">
                                    <div className="card-header">
                                        <div>
                                            <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                                            <p>{new Date(order.createdAt).toLocaleString()}</p>
                                        </div>
                                        <span className={`status-pill ${order.status}`}>{order.status}</span>
                                    </div>

                                    <div className="order-row">
                                        <div><strong>User:</strong> {order.user?.name || 'Unknown'}</div>
                                        <div><strong>Email:</strong> {order.user?.email}</div>
                                    </div>
                                    <div className="order-row">
                                        <div><strong>Total:</strong> ₹{order.totalPrice.toFixed(2)}</div>
                                        <div><strong>Items:</strong> {order.orderItems.length}</div>
                                    </div>
                                    <div className="order-row">
                                        <div><strong>Address:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}</div>
                                    </div>
                                    <div className="order-actions">
                                        <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)} disabled={saving === order._id || finalStatus}>
                                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <button onClick={() => navigate(`/orders/${order._id}`)} className="details-btn">View Details</button>
                                    </div>
                                    {finalStatus && <div className="final-note">Final status cannot be changed.</div>}
                                    <div className="approved-by">
                                        <span>Approved by:</span>
                                        <strong>{order.approvedBy ? `${order.approvedBy.name}` : 'Not approved yet'}</strong>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {!loading && filteredOrders.length === 0 && orders.length > 0 && (
                    <div className="empty-state">No orders match your filter.</div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
