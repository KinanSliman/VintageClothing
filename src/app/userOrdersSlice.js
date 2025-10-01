import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserOrders = createAsyncThunk(
  "orders/getUserOrders",
  async (userID, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // ✅ grab from localStorage
      const res = await axios.get(
        `https://vintageclothingserver.onrender.com/api/orders/getUserOrders/${userID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ send token
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const initialState = {
  orders: [],
  error: null,
};

const userOrdersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload.userOrders;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});
export default userOrdersSlice.reducer;
