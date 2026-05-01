import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  selectedCategory: "",
  selectedSize: "",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSize: (state, action) => {
      state.selectedSize = action.payload;
    },
  },
});

export const { setSearchQuery, setCategory, setSize } = filtersSlice.actions;
export default filtersSlice.reducer;