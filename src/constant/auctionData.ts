import { Images } from "../assets/images";

// Time (in seconds) the auction timer resets to after a new bid is placed.
export const COOLDOWN_SECONDS = 30;

// Maximum duration (in seconds) an auction can run before a forced reset.
export const MAX_AUCTION_DURATION_SECONDS = 300; // 5 minutes

// Suggested bid increment options for the user interface.
export const BID_INCREMENTS = [1000, 2000, 5000, 10000];

// This is the single document that holds the ID of the currently active auction.
export const CONTROL_DOC_ID = "current";

// Data used to initialize a NEW auction document.
export const INITIAL_PRODUCT_DATA = {
  productName: "Honda Civic 2025",
  productImage: Images.hondaCivic,
  currentBidAmount: 1000,
  minBidIncrement: 50, // Minimum acceptable bid increment
  currentBidderId: "system",
  currentBidderName: "System Start",
};

// Data used to initialize the Control document if it doesn't exist.
export const INITIAL_CONTROL_DATA = {
  activeAuctionId: null, // Will be set to the ID of the first auction created
  status: "awaiting_start",
  lastResetTime: null,
};

/**
 * Generates a unique, time-based ID for a new auction instance.
 * This is only called when we need to kick off a brand new, shared auction.
 */
export const generateUniqueId = () => `auction-${Date.now()}`;
