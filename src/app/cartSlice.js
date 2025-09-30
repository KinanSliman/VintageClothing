import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Each item: { product, quantity, size }
  isCartActive: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    keepCartActive: (state) => {
      state.isCartActive = true;
    },
    hideCart: (state) => {
      state.isCartActive = false;
    },
    toggleCartState: (state) => {
      state.isCartActive = !state.isCartActive;
    },
    addToCart: (state, action) => {
      const { product, size } = action.payload;

      const existingItem = state.items.find(
        (item) => item.product._id === product._id && item.size === size
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product, size, quantity: 1 });
      }
      state.isCartActive = true;
    },
    removeFromCart: (state, action) => {
      const { productId, size } = action.payload;

      const existingItem = state.items.find(
        (item) => item.product._id === productId && item.size === size
      );

      state.isCartActive = true;
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items = state.items.filter(
            (item) => !(item.product._id === productId && item.size === size)
          );
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCartItemSize: (state, action) => {
      const { productId, newSize } = action.payload;
      const item = state.items.find((i) => i.product._id === productId);
      if (item) {
        item.size = newSize;
      }
    },
  },
});

export const {
  toggleCartState,
  keepCartActive,
  hideCart,
  addToCart,
  removeFromCart,
  clearCart,
  setCartItemSize,
} = cartSlice.actions;

export default cartSlice.reducer;
