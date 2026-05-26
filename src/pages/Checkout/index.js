import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../data/api';
import './checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart, updateQty, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 cart, 2 address, 3 payment
  const [placing, setPlacing] = useState(false);
  const [orderMsg, setOrderMsg] = useState('');

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  // Payment UI stub
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paying, setPaying] = useState(false);

  const shipping = cartTotal > 500 ? 0 : 40;
  const total = cartTotal + shipping;

  const canContinueAddress = useMemo(
    () => address.street && address.city && address.state && address.zipCode,
    [address]
  );

  const canPay = cartItems.length > 0 && !!user && canContinueAddress;

  const handleProceed = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (step === 1) setStep(2);
    else if (step === 2) {
      if (!canContinueAddress) {
        setOrderMsg('Please fill all address fields');
        return;
      }
      setOrderMsg('');
      setStep(3);
    }
  };

  const handlePayNow = async () => {
    if (!user) return navigate('/login');
    if (!canPay) return;

    setPaying(true);
    setOrderMsg('');
    setPlacing(true);

    const orderItems = cartItems.map((i) => ({
      product: i._id,
      name: i.name,
      image: i.images?.[0] || '',
      price: i.price,
      quantity: i.qty,
    }));

    // This project currently creates an order without real payment processing.
    // paymentMethod is stored only in UI; backend does not yet process payments.
    const res = await createOrder({
      orderItems,
      shippingAddress: address,
      paymentMethod,
    });

    setPlacing(false);
    setPaying(false);

    if (res._id) {
      clearCart();
      navigate(`/orders/${res._id}`);
    } else {
      setOrderMsg(res.message || 'Order failed');
    }
  };

  if (!user && cartItems.length > 0) {
    // Let Header handle login link; keep UI clean.
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <h2>Your cart is empty</h2>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <p>Cart</p>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <p>Address</p>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <p>Payment</p>
          </div>
        </div>

        {step === 1 && (
          <div className="checkout-card">
            <h3>Review your cart</h3>
            <div className="checkout-items">
              {cartItems.map((item) => (
                <div key={item._id} className="checkout-item">
                  <img src={item.images?.[0] || 'https://via.placeholder.com/100'} alt={item.name} />
                  <div className="checkout-item-info">
                    <div className="checkout-item-title">{item.name}</div>
                    <div className="checkout-item-meta">₹{item.price.toFixed(2)} • {item.category}</div>
                  </div>
                  <div className="checkout-item-qty">
                    <button onClick={() => updateQty(item._id, item.qty - 1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                  </div>
                  <div className="checkout-item-total">₹{(item.price * item.qty).toFixed(2)}</div>
                  <button className="checkout-item-remove" onClick={() => removeFromCart(item._id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="checkout-summary">
              <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              <div className="summary-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>

            {orderMsg && <p className="checkout-msg">{orderMsg}</p>}

            <div className="checkout-actions">
              <button className="btn btn-primary" onClick={handleProceed}>
                Continue to Address
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="checkout-card">
            <h3>Shipping Address</h3>
            <div className="address-grid">
              <input placeholder="Street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
              <input placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              <input placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
              <input placeholder="ZIP Code" value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} />
              <input placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
            </div>

            {orderMsg && <p className="checkout-msg">{orderMsg}</p>}

            <div className="checkout-actions">
              <button className="btn btn-secondary" onClick={() => setStep(1)} disabled={placing}>
                Back to Cart
              </button>
              <button className="btn btn-primary" onClick={handleProceed} disabled={placing}>
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="checkout-card">
            <h3>Payment</h3>
            <div className="payment-methods">
              <label className={`pm ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <input type="radio" name="pm" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                Cash on Delivery
              </label>
              <label className={`pm ${paymentMethod === 'upi' ? 'active' : ''}`}>
                <input type="radio" name="pm" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                UPI
              </label>
              <label className={`pm ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input type="radio" name="pm" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                Card
              </label>
            </div>

            <div className="checkout-summary">
              <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              <div className="summary-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>

            {orderMsg && <p className="checkout-msg">{orderMsg}</p>}

            <div className="checkout-actions">
              <button className="btn btn-secondary" onClick={() => setStep(2)} disabled={placing}>
                Back to Address
              </button>
              <button className="btn btn-primary" onClick={handlePayNow} disabled={!canPay || paying}>
                {paying ? 'Processing...' : 'Pay Now'}
              </button>
            </div>

            <p className="checkout-note">
              Payment is UI-stubbed for now; order placement still uses your existing backend flow.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;

