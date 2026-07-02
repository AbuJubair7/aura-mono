import { create } from 'zustand';
import { fetchCart as apiFetchCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeFromCart as apiRemoveFromCart, Cart, CartItem } from '@/lib/api';

interface CartState {
  cartId: string | null;
  items: CartItem[];
  loading: boolean;
  
  // Actions
  fetchCart: (token: string) => Promise<void>;
  addItem: (token: string, productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (token: string, itemId: string, quantity: number) => Promise<void>;
  removeItem: (token: string, itemId: string) => Promise<void>;
  clearCart: () => void;
  
  // Getters
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartId: null,
  items: [],
  loading: false,

  fetchCart: async (token: string) => {
    set({ loading: true });
    try {
      const cartData = await apiFetchCart(token);
      set({ cartId: cartData.id, items: cartData.items, loading: false });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      set({ loading: false });
    }
  },

  addItem: async (token: string, productId: string, quantity = 1) => {
    set({ loading: true });
    try {
      await apiAddToCart(token, productId, quantity);
      const cartData = await apiFetchCart(token);
      set({ cartId: cartData.id, items: cartData.items, loading: false });
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      set({ loading: false });
      throw error;
    }
  },

  updateQuantity: async (token: string, itemId: string, quantity: number) => {
    if (quantity < 1) return;
    set({ loading: true });
    try {
      await apiUpdateCartItem(token, itemId, quantity);
      const cartData = await apiFetchCart(token);
      set({ items: cartData.items, loading: false });
    } catch (error) {
      console.error('Failed to update item quantity:', error);
      set({ loading: false });
    }
  },

  removeItem: async (token: string, itemId: string) => {
    set({ loading: true });
    try {
      await apiRemoveFromCart(token, itemId);
      const cartData = await apiFetchCart(token);
      set({ items: cartData.items, loading: false });
    } catch (error) {
      console.error('Failed to remove item:', error);
      set({ loading: false });
    }
  },

  clearCart: () => {
    set({ cartId: null, items: [], loading: false });
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((total, item) => {
      // Coerce price just in case, though API should handle it
      const price = Number(item.product.price);
      return total + (price * item.quantity);
    }, 0);
  },
}));
