import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../data/api';
import { useNavigate } from 'react-router-dom';
import './profile.css';

const Profile = () => {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '' });
    const [msg, setMsg] = useState('');

    if (!user) { navigate('/login'); return null; }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await updateProfile(form);
        if (res.token) { login(res); setMsg('Profile updated successfully!'); }
        else setMsg(res.message || 'Update failed');
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-grid">
                    <div className="profile-sidebar">
                        <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                        {user.isAdmin && <span className="admin-badge">Admin</span>}
                        <nav>
                            <a href="/profile" className="active">My Profile</a>
                            <a href="/orders">My Orders</a>
                            <button onClick={() => { logout(); navigate('/'); }}>Logout</button>
                        </nav>
                    </div>

                    <div className="profile-content">
                        <h2>Edit Profile</h2>
                        {msg && <div className="profile-msg">{msg}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>New Password <span>(leave blank to keep current)</span></label>
                                <input type="password" placeholder="New password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                            </div>
                            <button type="submit" className="save-btn">Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
