import { useState, useEffect } from 'react';
import { useCartQuery, useUpdateCartMutation } from './queries/useCartQueries';

const BASE_CART_STORAGE_KEY = 'zar3a_cart';
const getCartStorageKey = (userId) => (userId ? `${BASE_CART_STORAGE_KEY}_${userId}` : BASE_CART_STORAGE_KEY);

export const useCart = (userId) => {
  const [cart, setCart] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const cartKey = getCartStorageKey(userId);
  
  const { data: cartData, isSuccess } = useCartQuery(userId);
  const updateCartMutation = useUpdateCartMutation();

  // Load cart from localStorage or backend on mount
  useEffect(() => {
    // Try to get from localStorage first
    const saved = localStorage.getItem(cartKey);
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse cart from storage', error);
      }
    }
    setInitialized(true);
  }, [cartKey]);

  // When backend data loads, sync it to local state
  useEffect(() => {
    if (isSuccess && cartData?.items?.length > 0) {
      setCart(cartData.items);
      localStorage.setItem(cartKey, JSON.stringify(cartData.items));
    }
  }, [isSuccess, cartData, cartKey]);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, initialized, cartKey]);

  // Sync with backend whenever cart changes (if user is logged in)
  useEffect(() => {
    if (!initialized || !userId) return;

    const timeout = setTimeout(() => {
      updateCartMutation.mutate(cart);
    }, 500); // Debounce syncing
    
    return () => clearTimeout(timeout);
  }, [cart, initialized, userId]);

  const addToCart = (product, type = 'crop') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id && item.type === type);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id && item.type === type
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          imageUrl: product.imageUrl || product.image || '',
          unit: product.unit || 'unit',
          type,
          quantity: 1,
          marketplaceType: product.marketplaceType || (type === 'crop' ? 'CROP_MARKET' : 'AGRI_MARKET'),
        },
      ];
    });
  };

  const removeFromCart = (productId, type) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.type === type)));
  };

  const updateQuantity = (productId, type, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId, type);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.type === type ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  };
};
