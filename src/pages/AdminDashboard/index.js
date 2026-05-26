import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../../data/api';
import { useAuth } from '../../context/AuthContext';
import './admindashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user || !user.isAdmin) { navigate('/login'); return; }
        getOrders().then(data => { setOrders(data || []); setLoading(false); });
    }, [user, navigate]);

    const summary = useMemo(() => {
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        const approved = orders.filter(o => o.status === 'approved').length;
        const cancelled = orders.filter(o => o.status === 'cancelled').length;
        const pending = orders.filter(o => o.status === 'pending').length;
        return { totalOrders, totalRevenue, approved, cancelled, pending };
    }, [orders]);

    const handleApprove = async (orderId) => {
        setMessage('');
        setSaving(orderId);
        try {
            const res = await updateOrderStatus(orderId, 'approved');
            if (res && res._id) {
                setOrders(prev => prev.map(o => o._id === orderId ? res : o));
                setMessage('Order approved successfully.');
            } else {
                setMessage(res?.message || 'Unable to approve order.');
            }
        } catch {
            setMessage('Network error. Please try again.');
        }
        setSaving('');
    };

    const handleCancel = async (orderId) => {
        setMessage('');
        setSaving(orderId);
        try {
            const res = await updateOrderStatus(orderId, 'cancelled');
            if (res && res._id) {
                setOrders(prev => prev.map(o => o._id === orderId ? res : o));
                setMessage('Order cancelled successfully.');
            } else {
                setMessage(res?.message || 'Unable to cancel order.');
            }
        } catch {
            setMessage('Network error. Please try again.');
        }
        setSaving('');
    };

    if (!user || !user.isAdmin) return null;

    return (
        <div className="admin-dashboard-page">
            <div className="container">
                <header className="admin-header">
                    <div>
                        <p>Admin Dashboard</p>
                        <h1>Manage orders and review sales metrics</h1>
                    </div>
                </header>

                <div className="admin-summary-grid">
                    <div className="stat-card">
                        <span>Total orders</span>
                        <strong>{summary.totalOrders}</strong>
                    </div>
                    <div className="stat-card">
                        <span>Total revenue</span>
                        <strong>₹{summary.totalRevenue.toFixed(2)}</strong>
                    </div>
                    <div className="stat-card">
                        <span>Pending orders</span>
                        <strong>{summary.pending}</strong>
                    </div>
                    <div className="stat-card">
                        <span>Approved orders</span>
                        <strong>{summary.approved}</strong>
                    </div>
                    <div className="stat-card">
                        <span>Cancelled orders</span>
                        <strong>{summary.cancelled}</strong>
                    </div>
                </div>

                {message && <div className="admin-message">{message}</div>}

                <section className="orders-panel">
                    <div className="section-header">
                        <h2>Order queue</h2>
                        <p>Approve or cancel new orders and review approval history.</p>
                    </div>
                    {loading ? (
                        <div className="loader">Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="empty-state">No orders available yet.</div>
                    ) : (
                        <div className="orders-table">
                            <div className="table-head">
                                <span>Order</span>
                                <span>Customer</span>
                                <span>Total</span>
                                <span>Status</span>
                                <span>Approved By</span>
                                <span>Action</span>
                            </div>
                            {orders.map(order => {
                                const finalStatus = ['approved', 'cancelled', 'delivered'].includes(order.status);
                                return (
                                    <div key={order._id} className="table-row">
                                        <span>#{order._id.slice(-6).toUpperCase()}</span>
                                        <span>{order.user?.name || 'Unknown'}</span>
                                        <span>₹{order.totalPrice.toFixed(2)}</span>
                                        <span className={`status-pill ${order.status}`}>{order.status}</span>
                                        <span>{order.approvedBy?.name || '—'}</span>
                                        <span className="actions-cell">
                                            <button className="btn-approve" onClick={() => handleApprove(order._id)} disabled={saving === order._id || finalStatus || order.status !== 'pending'}>
                                                Approve
                                            </button>
                                            <button className="btn-cancel" onClick={() => handleCancel(order._id)} disabled={saving === order._id || finalStatus || order.status !== 'pending'}>
                                                Cancel
                                            </button>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
