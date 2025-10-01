import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// =====================
// Fetch all products with filters
// =====================
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState }) => {
    const { products } = getState();
    const { search, page, limit, priceRange, category, size, color, fit } =
      products;

    const params = {
      page,
      limit,
      search,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      category,
      size: size.join(","), // send arrays as CSV
      color: color.join(","),
      fit,
    };

    const res = await axios.get(
      "https://vintageclothingserver.onrender.com/api/products/getAllProducts",
      { params }
    );

    return res.data; // should return { fetchedProducts, totalPages }
  }
);

// =====================
// Fetch max price from backend
// =====================
export const fetchMaxPrice = createAsyncThunk(
  "products/fetchMaxPrice",
  async () => {
    const res = await axios.get(
      "https://vintageclothingserver.onrender.com/api/products/maxPrice"
    );
    return res.data.maxPrice || 100; // default to 100 if none
  }
);

// =====================
// Initial state
// =====================
const initialState = {
  products: [],
  totalPages: 1,
  isLoading: false,
  error: null,
  search: "",
  page: 1,
  limit: 10,
  priceRange: [0, 100],
  maxPrice: 100,
  category: "",
  size: [],
  color: [],
  fit: "",
};

// =====================
// Slice
// =====================
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
      state.page = 1;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
      state.page = 1;
    },
    setSize: (state, action) => {
      state.size = action.payload;
      state.page = 1;
    },
    setColor: (state, action) => {
      state.color = action.payload;
      state.page = 1;
    },
    setFit: (state, action) => {
      state.fit = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    // =====================
    // fetchProducts
    // =====================
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.fetchedProducts;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    // =====================
    // fetchMaxPrice
    // =====================
    builder
      .addCase(fetchMaxPrice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMaxPrice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.maxPrice = action.payload;

        // Initialize priceRange if still default
        if (state.priceRange[1] === 100) {
          state.priceRange = [0, action.payload];
        }
      })
      .addCase(fetchMaxPrice.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// =====================
// Exports
// =====================
export const {
  setPage,
  setSearch,
  setPriceRange,
  setCategory,
  setSize,
  setColor,
  setFit,
} = productsSlice.actions;

export default productsSlice.reducer;
