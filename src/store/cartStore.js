// src/store/cartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// The persist middleware will automatically save the cart to localStorage.
// This means the cart won't be empty even if the user refreshes the page.
export const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [], // The array of items in the cart

      // Actions
      addItem: (item) => {
        // Add a new item to the cart array
        set((state) => ({ items: [...state.items, item] }));
        console.log('Item added to cart:', get().items);
      },

      removeItem: (itemId) => {
        // Filter out the item with the matching id
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      clearCart: () => {
        // Reset the items array to be empty
        set({ items: [] });
      },
      
      // Selectors (optional, but good practice)
      getItemCount: () => get().items.length,
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.totalPrice, 0);
      }
    }),
    {
      name: 'move-rentals-cart', // name of the item in the storage (must be unique)
    }
  )
);