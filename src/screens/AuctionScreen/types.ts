// src/screens/AuctionScreen/types.ts

export interface BidHistory {
  id: string;
  userName: string;
  amount: number;
  timestamp: number;
  userId: string;
}

export interface BidRecord {
  id: string;
  amount: number;
  userId: string;
  userName: string;
  timestamp: number; // Changed from Date to number
}

export interface RenderBidItemProps {
  item: BidHistory;
}

export interface AuctionData {
  productName: string;
  productImage: string;
  currentBidAmount: number;
  currentBidderId: string;
  currentBidderName: string;
  lastBidTime: Date;
  minBidIncrement: number;
}

export type AuctionState = "ACTIVE" | "ENDED";

export interface AuctionDataType {
  productName: string;
  currentBid: number;
  highestBidder: string;
  highestBidderId: string;
  lastBidTime: number;
  bidsMade: number;
  currentBidderId?: string;
}
