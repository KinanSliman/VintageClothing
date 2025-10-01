import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchOffers = createAsyncThunk(
  "offers/getOffers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "https://vintageclothingserver.onrender.com//api/offers/getOffers"
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const initialState = {
  offers: [],
  isLoading: false,
  error: null,
};

const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.offers = action.payload.fetchedOffers;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});
export default offersSlice.reducer;
