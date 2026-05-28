const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getToken = () => JSON.parse(localStorage.getItem('quickmart_user'))?.token;

const headers = () => ({
    'Content-Type': 'application/json',
    ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
});

// Auth
export const registerUser = (data) => fetch(`${BASE_URL}/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());
export const loginUser = (data) => fetch(`${BASE_URL}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());
export const getProfile = () => fetch(`${BASE_URL}/auth/profile`, { headers: headers() }).then(r => r.json());
export const updateProfile = (data) => fetch(`${BASE_URL}/auth/profile`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

// Products
export const getProducts = (params = '') => fetch(`${BASE_URL}/products?${params}`).then(r => r.json());
export const getProductById = (id) => fetch(`${BASE_URL}/products/${id}`).then(r => r.json());
export const getCategories = () => fetch(`${BASE_URL}/products/categories`).then(r => r.json());
export const addReview = (id, data) => fetch(`${BASE_URL}/products/${id}/reviews`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

// Admin Products
export const createProduct = (data) => fetch(`${BASE_URL}/products`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());
export const updateProduct = (id, data) => fetch(`${BASE_URL}/products/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());
export const deleteProduct = (id) => fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE', headers: headers() }).then(r => r.json());

// Upload
export const uploadImage = (formData) => fetch(`${BASE_URL}/upload`, { method: 'POST', headers: { ...(getToken() && { Authorization: `Bearer ${getToken()}` }) }, body: formData }).then(r => r.json());

// Orders
export const createOrder = (data) => fetch(`${BASE_URL}/orders`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());
export const getMyOrders = () => fetch(`${BASE_URL}/orders/myorders`, { headers: headers() }).then(r => r.json());
export const getOrderById = (id) => fetch(`${BASE_URL}/orders/${id}`, { headers: headers() }).then(r => r.json());
export const getOrders = () => fetch(`${BASE_URL}/orders`, { headers: headers() }).then(r => r.json());
export const updateOrderStatus = (id, data) => fetch(`${BASE_URL}/orders/${id}/status`, { method: 'PUT', headers: headers(), body: JSON.stringify({ status: data }) }).then(r => r.json());

