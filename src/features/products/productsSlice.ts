import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { Product } from "../../types";

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  selectedSize: string;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: "",
  selectedCategory: "",
  selectedSize: "",
};

const SIZES = ["XS", "S", "M", "L", "XL"];

const CLOTHING_CATEGORIES = [
  "men's clothing",
  "women's clothing",
  "mens-shirts",
  "tops",
  "womens-dresses",
];

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async () => {
    const [fakeRes, dummyRes] = await Promise.all([
      fetch("https://fakestoreapi.com/products"),
      fetch("https://dummyjson.com/products?limit=100"),
    ]);

    const fakeData: any[] = await fakeRes.json();
    const dummyData = await dummyRes.json();

    // ✅ Normalize fake API
    const fakeProducts: Product[] = fakeData
      .filter((p) => CLOTHING_CATEGORIES.includes(p.category))
      .map((p, i) => ({
        id: p.id,
        uid: `fake-${p.id}-${i}`,
        title: p.title+`-${p.id}-${i}`, // ✅ clean title
        price: p.price,
        description: p.description.slice(0, 120) + "...",
        category: p.category,
        image: p.image,
        rating: {
          rate: p.rating?.rate || 4.2,
          count: p.rating?.count || 120,
        },
        size: SIZES[i % SIZES.length],
      }));

    // ✅ Normalize dummy API
    const dummyProducts: Product[] = dummyData.products
      .filter((p: any) => CLOTHING_CATEGORIES.includes(p.category))
      .map((p: any, i: number) => ({
        id: 1000 + p.id,
        uid: `dummy-${p.id}-${i}`,
        title: p.title+`-${p.id}-${i}`, // ✅ clean title
        price: p.price,
        description: p.description.slice(0, 120) + "...",
        category: p.category,
        image: p.thumbnail,
        rating: {
          rate: p.rating || 4.5,
          count: p.stock || 100,
        },
        size: SIZES[i % SIZES.length],
      }));

    const all = [...fakeProducts, ...dummyProducts];

    // ✅ Create large dataset WITHOUT duplicating references
    const extended = Array.from({ length: 7 }, (_, batchIndex) =>
      all.map((p, index) => ({
        ...p,
        uid: `${p.uid}-${batchIndex}-${index}`, // ✅ guaranteed unique
      }))
    ).flat();

    return extended;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setSelectedSize(state, action: PayloadAction<string>) {
      state.selectedSize = action.payload;
    },
    resetFilters(state) {
      state.searchQuery = "";
      state.selectedCategory = "";
      state.selectedSize = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const selectFilteredSortedProducts = createSelector(
  (state: RootState) => state.products.items,
  (state: RootState) => state.products.searchQuery,
  (state: RootState) => state.products.selectedCategory,
  (state: RootState) => state.products.selectedSize,
  (items, search, category, size) =>
    items.filter((p) => {
      const matchSearch =
        !search || p.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        !category || p.category === category;
      const matchSize =
        !size || p.size === size;
      return matchSearch && matchCategory && matchSize;
    })
);

export const {
  setSearchQuery,
  setSelectedCategory,
  setSelectedSize,
  resetFilters,
} = productsSlice.actions;

export default productsSlice.reducer;