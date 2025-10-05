import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WinnerModalState {
  showWinnerModal: boolean;
  lastDismissedAuctionId: string | null;
  winnerName: string;
  lastEndedAuctionId: string | null; // Track which auction the winner name belongs to
}

const initialState: WinnerModalState = {
  showWinnerModal: false,
  lastDismissedAuctionId: null,
  winnerName: "",
  lastEndedAuctionId: null,
};

const winnerModalSlice = createSlice({
  name: "winnerModal",
  initialState,
  reducers: {
    openWinnerModal: (state, action: PayloadAction<string>) => {
      // Only open if not previously dismissed for this auction
      if (state.lastDismissedAuctionId !== action.payload) {
        state.showWinnerModal = true;
      }
    },
    dismissWinnerModal: (state, action: PayloadAction<string>) => {
      state.showWinnerModal = false;
      state.lastDismissedAuctionId = action.payload;
      // Keep winner name and auction ID - only reset when explicitly closed
    },
    closeWinnerModal: (state) => {
      // Explicitly close and clear all data (used when navigating away)
      state.showWinnerModal = false;
      state.winnerName = "";
      state.lastEndedAuctionId = null;
      // Don't reset lastDismissedAuctionId so we don't show it again
    },
    setWinnerName: (
      state,
      action: PayloadAction<{ auctionId: string; winnerName: string }>
    ) => {
      // Always update winner name when auction ends
      state.winnerName = action.payload.winnerName;
      state.lastEndedAuctionId = action.payload.auctionId;
    },
    resetWinnerModal: () => {
      return initialState;
    },
  },
});

export const {
  openWinnerModal,
  dismissWinnerModal,
  closeWinnerModal, // ✅ Add this missing export
  resetWinnerModal,
  setWinnerName,
} = winnerModalSlice.actions;

export default winnerModalSlice.reducer;
