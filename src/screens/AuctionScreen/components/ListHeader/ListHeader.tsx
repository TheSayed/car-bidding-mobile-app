import { View, Text } from "react-native";
import React, { memo } from "react";
import styles from "./ListHeader.styles";
import TimerDisplay from "../TimerDisplay/TimerDisplay";
import { COOLDOWN_SECONDS } from "../../../../constant/auctionData";

// Local types for ListHeader
interface AuctionData {
  productName: string;
  productImage: string;
  currentBidAmount: number;
  currentBidderId: string;
  currentBidderName: string;
  lastBidTime: Date;
  minBidIncrement: number;
}

interface BidRecord {
  id: string;
  amount: number;
  userId: string;
  userName: string;
  timestamp: Date;
}

type ListHeaderProps = {
  liveBiddersCount: number;
  auctionData: AuctionData;
  displayCurrentBid: string;
  bidsCount: number; // Changed from bids array to just count
  isEnded: boolean;
};

const ListHeader = ({
  liveBiddersCount,
  auctionData,
  displayCurrentBid,
  bidsCount,
  isEnded,
}: ListHeaderProps) => {
  const circleStyle = isEnded ? styles.circleInactive : styles.circleActive;

  return (
    <View style={styles.infoHeader}>
      {/* Bidding Stats Card */}
      <View style={styles.biddingInfo}>
        <View style={styles.startBiddingContainer}>
          <Text style={styles.startBiddingText}>Current Bidder</Text>
          <Text style={styles.bidAmountText}>
            {auctionData.currentBidderName}
          </Text>
          <View style={styles.liveBiddersContainer}>
            <Text style={styles.liveBiddersLabel}>Live Bidders: </Text>
            <Text style={styles.liveBiddersValue}>{liveBiddersCount}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.currentBidContainer}>
          <Text style={styles.startBiddingText}>Current Bid</Text>
          <Text style={[styles.bidAmountText, styles.highlightBid]}>
            ${displayCurrentBid}
          </Text>
          <View style={styles.liveBiddersContainer}>
            <TimerDisplay
              lastBidTime={
                auctionData.lastBidTime
                  ? auctionData.lastBidTime.getTime()
                  : undefined
              }
              cooldownSeconds={COOLDOWN_SECONDS}
            />
          </View>
        </View>
      </View>

      {/* Live Auction Header */}
      <View style={styles.auctionContainer}>
        <View style={styles.liveAuctionContainer}>
          <View style={[styles.circle, circleStyle]} />
          <Text style={styles.liveAuctionText}>Live Bid History</Text>
        </View>
        <Text style={styles.bidsMadeText}>{bidsCount} Bids Made</Text>
      </View>
    </View>
  );
};

// Custom comparison function for memo
const areEqual = (prevProps: ListHeaderProps, nextProps: ListHeaderProps) => {
  return (
    prevProps.liveBiddersCount === nextProps.liveBiddersCount &&
    prevProps.displayCurrentBid === nextProps.displayCurrentBid &&
    prevProps.bidsCount === nextProps.bidsCount &&
    prevProps.isEnded === nextProps.isEnded &&
    prevProps.auctionData.currentBidderName ===
      nextProps.auctionData.currentBidderName &&
    prevProps.auctionData.lastBidTime.getTime() ===
      nextProps.auctionData.lastBidTime.getTime()
  );
};

export default memo(ListHeader, areEqual);
