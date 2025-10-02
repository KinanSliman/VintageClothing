// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import cartReducer from "./cartSlice";
import productsReducer from "./productsSlice";
import offersReducer from "./offersSlice";
import ordersReducer from "./userOrdersSlice";

// Persist config for cart slice
const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items"], // persist only cart items
};

// Wrap cart reducer with persistReducer
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer, // persisted cart
    products: productsReducer,
    offers: offersReducer,
    orders: ordersReducer,
  },
});

// Create persistor
export const persistor = persistStore(store);
