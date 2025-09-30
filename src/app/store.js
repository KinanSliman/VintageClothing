// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../app/cartSlice";
import productsReducer from "../app/productsSlice"; // 👈 Import your new slice
import offersReducer from "../app/offersSlice";
import ordersReducer from "../app/userOrdersSlice";
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer, // 👈 Add it to the store
    offers: offersReducer,
    orders: ordersReducer,
  },
});
