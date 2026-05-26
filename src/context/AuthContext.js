import { createContext, useContext, useEffect, useState } from 'react';
import { getProfile } from '../data/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('quickmart_user')) || null);
    const [authReady, setAuthReady] = useState(false);

    // On app load, verify token and refresh user data (especially isAdmin) from DB
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('quickmart_user'));
        if (!stored?.token) {
            setAuthReady(true);
            return;
        }
        getProfile()
            .then(data => {
                if (data?._id) {
                    // Merge fresh DB data with stored token
                    const refreshed = { ...stored, ...data, token: stored.token };
                    localStorage.setItem('quickmart_user', JSON.stringify(refreshed));
                    setUser(refreshed);
                } else {
                    // Token invalid/expired — log out
                    localStorage.removeItem('quickmart_user');
                    setUser(null);
                }
            })
            .catch(() => {
                // Backend down — keep stored user so app still works offline
            })
            .finally(() => setAuthReady(true));
    }, []);

    const login = (userData) => {
        localStorage.setItem('quickmart_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('quickmart_user');
        setUser(null);
    };

    // Don't render app until auth is verified — prevents flash redirect to /login
    if (!authReady) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7fb' }}>
            <div style={{ width: 40, height: 40, border: '4px solid #ebebf0', borderTop: '4px solid #ff6b2c', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    return ctx || { user: null, login: () => {}, logout: () => {} };
};
