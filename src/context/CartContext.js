import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem('quickmart_cart')) || []);

    const saveCart = (items) => {
        setCartItems(items);
        localStorage.setItem('quickmart_cart', JSON.stringify(items));
    };

    const addToCart = (product, qty = 1) => {
        const exists = cartItems.find(i => i._id === product._id);
        const updated = exists
            ? cartItems.map(i => i._id === product._id ? { ...i, qty: i.qty + qty } : i)
            : [...cartItems, { ...product, qty }];
        saveCart(updated);
    };

    const removeFromCart = (id) => saveCart(cartItems.filter(i => i._id !== id));

    const updateQty = (id, qty) => {
        const nextQty = Number(qty);
        if (Number.isNaN(nextQty) || nextQty < 1) return removeFromCart(id);

        saveCart(
            cartItems.map(i =>
                i._id === id ? { ...i, qty: nextQty } : i
            )
        );
    };

    const clearCart = () => saveCart([]);

    const cartTotal = cartItems.reduce((acc, i) => acc + i.price * i.qty, 0);
    const cartCount = cartItems.reduce((acc, i) => acc + i.qty, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
