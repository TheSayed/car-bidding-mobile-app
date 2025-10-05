import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import modalReducer from "./winnerModalSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    winnerModal: modalReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
