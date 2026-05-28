import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FaMinus, FaPlus, FaTrash, FaShoppingBag } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const shipping = cartTotal > 500 ? 0 : 40;
    const total = cartTotal + shipping;

    if (cartItems.length === 0) return (
        <div className="empty-cart">
            <FaShoppingBag />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/products" className="shop-btn">Start Shopping</Link>
        </div>
    );

    return (
        <div className="cart-page">
            <div className="container">
                <h2 className="cart-title">Shopping Cart <span>({cartItems.length} items)</span></h2>
                <div className="cart-grid">
                    {/* Cart Items */}
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item._id} className="cart-item">
                                <img src={item.images?.[0] || 'https://via.placeholder.com/100'} alt={item.name} />
                                <div className="item-info">
                                    <Link to={`/products/${item._id}`} className="item-name">{item.name}</Link>
                                    <span className="item-category">{item.category}</span>
                                    <span className="item-price">₹{item.price.toFixed(2)}</span>
                                </div>
                                <div className="item-qty">
                                    <button onClick={() => updateQty(item._id, item.qty - 1)}><FaMinus /></button>
                                    <span>{item.qty}</span>
                                    <button onClick={() => updateQty(item._id, item.qty + 1)}><FaPlus /></button>
                                </div>
                                <span className="item-total">₹{(item.price * item.qty).toFixed(2)}</span>
                                <button className="remove-btn" onClick={() => { removeFromCart(item._id); toast.success('Item removed from cart'); }}><FaTrash /></button>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
                        <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                        <div className="summary-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>

                        <button
                            className="checkout-btn"
                            onClick={() => (user ? navigate('/checkout') : navigate('/login'))}
                        >
                            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                        </button>
                        {!user && <Link to="/login" className="login-link">Login / Register</Link>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
