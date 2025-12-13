import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Sweet } from '@/lib/api';

interface CartItem {
  sweet: Sweet;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (sweet: Sweet, quantity?: number) => void;
  removeItem: (sweetId: string) => void;
  updateQuantity: (sweetId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (sweet, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.sweet._id === sweet._id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.sweet._id === sweet._id
                ? { ...item, quantity: Math.min(item.quantity + quantity, sweet.quantity) }
                : item
            ),
          });
        } else {
          set({ items: [...items, { sweet, quantity }] });
        }
      },
      removeItem: (sweetId) => {
        set({ items: get().items.filter((item) => item.sweet._id !== sweetId) });
      },
      updateQuantity: (sweetId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(sweetId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.sweet._id === sweetId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.sweet.price * item.quantity, 0);
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
