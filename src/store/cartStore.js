import { create } from "zustand";
import { persist } from "zustand/middleware";

const storageWithDateReviver = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) {
      return null;
    }
    const storedState = JSON.parse(str);

    const revivedItems = storedState.state.items.map((item) => {
      if (item.range && item.range.from && item.range.to) {
        return {
          ...item,
          range: {
            from: new Date(item.range.from),
            to: new Date(item.range.to),
          },
        };
      }
      return item;
    });

    return {
      ...storedState,
      state: {
        ...storedState.state,
        items: revivedItems,
      },
    };
  },
  setItem: (name, newValue) => {
    localStorage.setItem(name, JSON.stringify(newValue));
  },
  removeItem: (name) => localStorage.removeItem(name),
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => ({ items: [...state.items, item] }));
      },
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      getItemCount: () => get().items.length,
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.totalPrice, 0);
      },
    }),
    {
      name: "move-rentals-cart",
      storage: storageWithDateReviver,
    }
  )
);
