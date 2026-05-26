import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../data/api';
import { useAuth } from '../../context/AuthContext';
import './auth.css';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/home');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) return setError('Passwords do not match');
        setLoading(true); setError('');
        const res = await registerUser({ name: form.name, email: form.email, password: form.password });
        setLoading(false);
        if (res.token) { login(res); navigate('/home'); }
        else setError(res.message || 'Registration failed');
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Create Account 🛒</h2>
                <p className="auth-sub">Join QuickMart and start shopping</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="Enter your name" value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Enter your email" value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="Create a password" value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" placeholder="Confirm your password" value={form.confirm}
                            onChange={e => setForm({ ...form, confirm: e.target.value })} required />
                    </div>
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Register;
