import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/products/productsSlice";
import { combineReducers } from "@reduxjs/toolkit";
import filtersReducer from "../features/products/filtersSlice";

const rootReducer = combineReducers({
  products: productsReducer,
  filters: filtersReducer,
});
export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;