import React from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";

// Styles & Constants
import styles from "./AuctionScreen.styles";
import { COLORS } from "../../constant/COLORS";
import {
  BID_INCREMENTS,
  INITIAL_PRODUCT_DATA,
} from "../../constant/auctionData";

// Components
import ListHeader from "./components/ListHeader/ListHeader";
import WinnerModal from "./components/WinnerModal/WinnerModal";
import BidControls from "./components/BidControls/BidControls";
import AuctionHeader from "./components/AuctionHeader/AuctionHeader";
import { BidItem } from "./components/BidIem/BidItem";

// Types
import { RenderBidItemProps } from "./types";
import useAuctionScreenHook from "./hooks/useAuctionScreenHook";

const AuctionScreen = () => {
  const {
    auctionData,
    bidsHistory,
    auctionState,
    loading,
    currentAuctionId,
    userId,
    userName,
    isWinner,
    selectedIncrement,
    isBidding,
    showWinnerModal,
    modalCountdown,
    liveBiddersCount,
    ctaDisabled,
    ctaText,
    displayCurrentBid,
    storedWinnerName,
    handlePlaceBid,
    setSelectedIncrement,
    handleBackToLanding,
  } = useAuctionScreenHook();

  const isEnded = auctionState === "ENDED";

  const renderBidItem = ({ item }: RenderBidItemProps) => (
    <BidItem item={item} isCurrentUser={item.userId === userId} />
  );

  if (loading || !auctionData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.ACCENT_ORANGE} />
        <Text style={{ marginTop: 10, color: COLORS.PRIMARY_BLACK }}>
          Connecting to the auction feed...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Winner Modal */}
      <WinnerModal
        visible={showWinnerModal}
        isWinner={isWinner}
        userName={userName}
        winnerName={storedWinnerName || "No one"}
        winningBid={displayCurrentBid + ""}
        countdown={modalCountdown}
        onBackToLanding={handleBackToLanding}
      />

      {/* Header Info */}
      <AuctionHeader
        productName={auctionData.productName}
        userName={userName}
        currentAuctionId={currentAuctionId}
      />

      {/* List Header */}
      <ListHeader
        liveBiddersCount={liveBiddersCount}
        auctionData={{
          productName: auctionData.productName,
          productImage: INITIAL_PRODUCT_DATA.productImage,
          currentBidAmount: auctionData.currentBid,
          currentBidderId: auctionData.highestBidderId,
          currentBidderName: auctionData.highestBidder,
          lastBidTime: new Date(auctionData.lastBidTime),
          minBidIncrement: BID_INCREMENTS[0],
        }}
        displayCurrentBid={displayCurrentBid + ""}
        bidsCount={bidsHistory.length}
        isEnded={isEnded}
      />

      {/* Bid List */}
      <FlatList
        data={bidsHistory}
        renderItem={renderBidItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.bidListContent}
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: 60,
          offset: 60 * index,
          index,
        })}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={15}
        windowSize={10}
      />

      {/* Controls */}
      <BidControls
        selectedIncrement={selectedIncrement}
        isBidding={isBidding}
        ctaDisabled={ctaDisabled}
        ctaText={ctaText}
        currentBid={auctionData.currentBid}
        onSelectIncrement={setSelectedIncrement}
        onPlaceBid={handlePlaceBid}
      />
    </View>
  );
};

export default AuctionScreen;
