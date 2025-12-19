import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { CartItem, Product } from "@/types/store";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => Promise<void> | void;
  removeItem: (productId: string) => Promise<void> | void;
  updateQuantity: (productId: string, quantity: number) => Promise<void> | void;
  clearCart: () => Promise<void> | void;
  syncCart: () => Promise<void> | void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: async (product: Product, quantity = 1) => {
        const authState = useAuthStore.getState();
        if (!authState.isAuthenticated) {
          const { items } = get();
          const existingItem = items.find((item) => item.product.id === product.id);

          if (existingItem) {
            set({
              items: items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: Math.min(item.quantity + quantity, product.stockCount) }
                  : item,
              ),
            });
          } else {
            set({ items: [...items, { product, quantity }] });
          }
          return;
        }

        const cart = await apiPost<{ items: CartItem[] }>("/cart/items", {
          productId: product.id,
          quantity,
        });
        set({ items: cart.items });
      },

      removeItem: async (productId: string) => {
        const authState = useAuthStore.getState();
        if (!authState.isAuthenticated) {
          set({ items: get().items.filter((item) => item.product.id !== productId) });
          return;
        }

        const item = get().items.find((cartItem) => cartItem.product.id === productId);
        if (!item) {
          return;
        }
        const cart = await apiDelete<{ items: CartItem[] }>(`/cart/items/${item.id}`);
        set({ items: cart.items });
      },

      updateQuantity: async (productId: string, quantity: number) => {
        if (quantity <= 0) {
          await get().removeItem(productId);
          return;
        }

        const authState = useAuthStore.getState();
        if (!authState.isAuthenticated) {
          set({
            items: get().items.map((item) =>
              item.product.id === productId
                ? { ...item, quantity: Math.min(quantity, item.product.stockCount) }
                : item,
            ),
          });
          return;
        }

        const item = get().items.find((cartItem) => cartItem.product.id === productId);
        if (!item) {
          return;
        }

        const cart = await apiPut<{ items: CartItem[] }>(`/cart/items/${item.id}`, {
          quantity,
        });
        set({ items: cart.items });
      },

      clearCart: async () => {
        const authState = useAuthStore.getState();
        if (!authState.isAuthenticated) {
          set({ items: [] });
          return;
        }

        const cart = await apiDelete<{ items: CartItem[] }>("/cart");
        set({ items: cart.items });
      },
      syncCart: async () => {
        const authState = useAuthStore.getState();
        if (!authState.isAuthenticated) {
          return;
        }

        const cart = await apiGet<{ items: CartItem[] }>("/cart");
        set({ items: cart.items });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.product.price * item.quantity, 0),
    }),
    {
      name: 'aura-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
