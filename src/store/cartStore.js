import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Custom storage object for Zustand's persist middleware.
 * It handles the serialization and deserialization of Date objects,
 * which are not natively supported by JSON.stringify/parse.
 */
const storageWithDateReviver = {
  /**
   * Retrieves an item from localStorage and revives Date objects.
   * @param {string} name - The name of the item in localStorage.
   * @returns {object | null} The parsed state with revived dates.
   */
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) {
      return null;
    }
    const storedState = JSON.parse(str);

    // Revive date strings back into Date objects for each item in the cart.
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
  /**
   * Sets an item in localStorage.
   * @param {string} name - The name of the item.
   * @param {object} newValue - The state to be stored.
   */
  setItem: (name, newValue) => {
    // Dates are automatically converted to ISO strings by JSON.stringify.
    localStorage.setItem(name, JSON.stringify(newValue));
  },
  /**
   * Removes an item from localStorage.
   * @param {string} name - The name of the item to remove.
   */
  removeItem: (name) => localStorage.removeItem(name),
};

/**
 * Zustand store for managing the shopping cart state.
 * It uses `persist` middleware to save the cart to localStorage.
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      /**
       * An array of items in the cart.
       * @type {Array<object>}
       */
      items: [],

      /**
       * Adds a new item to the cart.
       * @param {object} item - The item to add.
       */
      addItem: (item) => {
        set((state) => ({ items: [...state.items, item] }));
      },

      /**
       * Removes an item from the cart by its ID.
       * @param {string} itemId - The ID of the item to remove.
       */
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      /**
       * Clears all items from the cart.
       */
      clearCart: () => {
        set({ items: [] });
      },

      /**
       * Returns the total number of items in the cart.
       * @returns {number}
       */
      getItemCount: () => get().items.length,

      /**
       * Calculates and returns the total price of all items in the cart.
       * @returns {number}
       */
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.totalPrice, 0);
      },
    }),
    {
      name: "move-rentals-cart", // Unique name for the localStorage item
      storage: storageWithDateReviver, // Use our custom storage engine
    }
  )
);
