import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiError, apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
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
    (set, get) => {
      const applyLocalAdd = (product: Product, quantity: number) => {
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
      };

      const applyLocalRemove = (productId: string) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
      };

      const applyLocalUpdate = (productId: string, quantity: number) => {
        set({
          items: get().items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.min(quantity, item.product.stockCount) }
              : item,
          ),
        });
      };

      const applyLocalClear = () => set({ items: [] });

      const handleAuthFallback = (error: unknown, fallback: () => void) => {
        if (!(error instanceof ApiError) || (error.status !== 401 && error.status !== 403)) {
          return false;
        }
        useAuthStore.getState().logout();
        fallback();
        return true;
      };

      return {
        items: [],
        isOpen: false,

        addItem: async (product: Product, quantity = 1) => {
          const authState = useAuthStore.getState();
          if (!authState.isAuthenticated) {
            applyLocalAdd(product, quantity);
            return;
          }

          try {
            const cart = await apiPost<{ items: CartItem[] }>("/cart/items", {
              productId: product.id,
              quantity,
            });
            set({ items: cart.items });
          } catch (error) {
            handleAuthFallback(error, () => applyLocalAdd(product, quantity));
          }
        },

        removeItem: async (productId: string) => {
          const authState = useAuthStore.getState();
          if (!authState.isAuthenticated) {
            applyLocalRemove(productId);
            return;
          }

          const item = get().items.find((cartItem) => cartItem.product.id === productId);
          if (!item) {
            return;
          }

          try {
            const cart = await apiDelete<{ items: CartItem[] }>(`/cart/items/${item.id}`);
            set({ items: cart.items });
          } catch (error) {
            handleAuthFallback(error, () => applyLocalRemove(productId));
          }
        },

        updateQuantity: async (productId: string, quantity: number) => {
          if (quantity <= 0) {
            await get().removeItem(productId);
            return;
          }

          const authState = useAuthStore.getState();
          if (!authState.isAuthenticated) {
            applyLocalUpdate(productId, quantity);
            return;
          }

          const item = get().items.find((cartItem) => cartItem.product.id === productId);
          if (!item) {
            return;
          }

          try {
            const cart = await apiPut<{ items: CartItem[] }>(`/cart/items/${item.id}`, {
              quantity,
            });
            set({ items: cart.items });
          } catch (error) {
            handleAuthFallback(error, () => applyLocalUpdate(productId, quantity));
          }
        },

        clearCart: async () => {
          const authState = useAuthStore.getState();
          if (!authState.isAuthenticated) {
            applyLocalClear();
            return;
          }

          try {
            const cart = await apiDelete<{ items: CartItem[] }>("/cart");
            set({ items: cart.items });
          } catch (error) {
            handleAuthFallback(error, applyLocalClear);
          }
        },
        syncCart: async () => {
          const authState = useAuthStore.getState();
          if (!authState.isAuthenticated) {
            return;
          }

          try {
            const cart = await apiGet<{ items: CartItem[] }>("/cart");
            set({ items: cart.items });
          } catch (error) {
            handleAuthFallback(error, () => undefined);
          }
        },

        openCart: () => set({ isOpen: true }),
        closeCart: () => set({ isOpen: false }),
        toggleCart: () => set({ isOpen: !get().isOpen }),

        getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),

        getTotalPrice: () =>
          get().items.reduce((total, item) => total + item.product.price * item.quantity, 0),
      };
    },
    {
      name: 'aura-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
