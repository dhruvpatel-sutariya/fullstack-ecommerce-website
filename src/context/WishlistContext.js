import { createContext, useContext, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

const WISHLIST_KEY = 'quickmart_wishlist';

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch {
      return [];
    }
  });

  const persist = (items) => {
    setWishlistItems(items);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  };

  const isWished = (productId) => wishlistItems.some((i) => i._id === productId);

  const toggleWishlist = (product) => {
    if (!product?._id) return;
    const exists = wishlistItems.find((i) => i._id === product._id);
    if (exists) {
      persist(wishlistItems.filter((i) => i._id !== product._id));
      toast.success('❤️ Removed from wishlist');
    } else {
      persist([...wishlistItems, product]);
      toast.success('❤️ Added to wishlist!');
    }
  };

  const removeFromWishlist = (productId) =>
    persist(wishlistItems.filter((i) => i._id !== productId));

  const clearWishlist = () => persist([]);

  const value = useMemo(
    () => ({
      wishlistItems,
      isWished,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [wishlistItems]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);

