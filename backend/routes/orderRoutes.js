const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendEmail = async (to, subject, html) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    try {
        await transporter.sendMail({ from: `QuickMart <${process.env.EMAIL_USER}>`, to, subject, html });
    } catch (e) {
        console.log('Email error:', e.message);
    }
};

const orderConfirmationEmail = (order, userName) => `
<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px">
  <h2 style="color:#d6006e">🛒 Order Confirmed!</h2>
  <p>Hi <b>${userName}</b>, your order has been placed successfully.</p>
  <p><b>Order ID:</b> ${order._id}</p>
  <table width="100%" cellpadding="8" style="border-collapse:collapse;margin:16px 0">
    <tr style="background:#f8f8fc"><th align="left">Product</th><th>Qty</th><th>Price</th></tr>
    ${order.orderItems.map(i => `<tr><td>${i.name}</td><td align="center">${i.quantity}</td><td align="right">₹${i.price}</td></tr>`).join('')}
    <tr style="border-top:2px solid #eee"><td colspan="2"><b>Total</b></td><td align="right"><b>₹${order.totalPrice}</b></td></tr>
  </table>
  <p><b>Shipping to:</b> ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
  <p style="color:#888;font-size:12px">Thank you for shopping with QuickMart!</p>
</div>`;

const statusUpdateEmail = (order, userName, status, message) => `
<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px">
  <h2 style="color:#d6006e">📦 Order Status Updated</h2>
  <p>Hi <b>${userName}</b>, your order status has been updated.</p>
  <p><b>Order ID:</b> ${order._id}</p>
  <p><b>New Status:</b> <span style="background:#fff0f7;color:#d6006e;padding:4px 12px;border-radius:999px;font-weight:700;text-transform:capitalize">${status}</span></p>
  <p>${message}</p>
  <p style="color:#888;font-size:12px">Thank you for shopping with QuickMart!</p>
</div>`;

const buildStatusMessage = (status) => {
    switch (status) {
        case 'approved':
            return 'Your order is approved. Processing will begin soon.';
        case 'processing':
            return 'Your order is processing.';
        case 'shipped':
            return 'Your order has been shipped.';
        case 'delivered':
            return 'Your order is confirmed and delivered. Thank you!';
        case 'cancelled':
            return 'Your order has been cancelled.';
        default:
            return `Order status updated to ${status}`;
    }
};

// @POST /api/orders
router.post('/', protect, async (req, res) => {
    try {
        const { orderItems, shippingAddress } = req.body;
        if (!orderItems || orderItems.length === 0)
            return res.status(400).json({ message: 'No order items' });

        const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const shippingPrice = itemsPrice > 500 ? 0 : 40;
        const totalPrice = itemsPrice + shippingPrice;

        const order = await Order.create({
            user: req.user._id, orderItems, shippingAddress,
            itemsPrice, shippingPrice, totalPrice,
        });

        // Update stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
        }

        // Send order confirmation email
        await sendEmail(
            req.user.email,
            '🛒 Order Confirmed - QuickMart',
            orderConfirmationEmail(order, req.user.name)
        );

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @GET /api/orders/myorders
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('approvedBy', 'name email');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @GET /api/orders (admin)
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @PUT /api/orders/:id/status (admin)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (['approved', 'cancelled', 'delivered'].includes(order.status)) {
            return res.status(400).json({ message: 'Order cannot be changed after final approval or cancellation' });
        }

        const newStatus = req.body.status;
        if (!['approved', 'cancelled', 'processing', 'shipped', 'delivered'].includes(newStatus)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        order.status = newStatus;
        order.approvedBy = req.user._id;

        if (newStatus === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        // Message for UI (shown in My Orders / Order Detail)
        order.statusMessage = buildStatusMessage(newStatus);

        const updated = await order.save();
        const populated = await updated.populate('user', 'name email').then(o => o.populate('approvedBy', 'name email'));

        // Send status update email to user
        await sendEmail(
            populated.user.email,
            `📦 Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} - QuickMart`,
            statusUpdateEmail(populated, populated.user.name, newStatus, buildStatusMessage(newStatus))
        );

        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

