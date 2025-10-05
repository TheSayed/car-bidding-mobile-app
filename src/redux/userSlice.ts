import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  uid: string | null;
  displayName: string | null;
}

const initialState: UserState = {
  uid: null,
  displayName: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (
      state,
      action: PayloadAction<{ uid: string; displayName: string }>
    ) => {
      state.uid = action.payload.uid;
      state.displayName = action.payload.displayName;
    },
    clearUserInfo: (state) => {
      state.uid = null;
      state.displayName = null;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
