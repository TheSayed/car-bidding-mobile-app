// LandingScreen.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import styles from "./LandingScreen.styles";
import useLandingScreenHook from "./useLandingScreenHook";
import useAuctionDataHook from "../hooks/useAuctionDataHook";
// Keep this one - it has the timer

const LandingScreen = () => {
  const {
    userName,
    handleNavigateToAuction,
    handleLinkedInPress,
    handleLogout,
  } = useLandingScreenHook();

  // Keep using the original hook here since LandingScreen DISPLAYS the timer
  const { formattedTime, auctionState, loading, auctionData } =
    useAuctionDataHook();

  const isBiddingActive = auctionState === "ACTIVE";

  const getStatusText = () => {
    if (loading) return "CONNECTING TO LIVE AUCTION...";
    if (auctionState === "ACTIVE") return `LIVE BIDDING: ${formattedTime} LEFT`;
    return "AUCTION CLOSED (Awaiting Next Item)";
  };

  const currentBid = auctionData?.currentBid;
  const highestBidder = auctionData?.highestBidder;

  const currentBidFormatted = currentBid
    ? `$${currentBid.toLocaleString()}`
    : "$20,000";
  const highestBidderText =
    highestBidder && highestBidder !== "System Start"
      ? highestBidder
      : "No Bids Yet";

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>
          Hello, <Text style={styles.nameHighlight}>{userName || "Guest"}</Text>
          !
        </Text>
        <Text style={styles.sloganText}>
          The keys to your dream car are waiting.
        </Text>
      </View>
      <Pressable
        onPress={handleNavigateToAuction}
        style={({ pressed }) => [
          styles.auctionButton,
          { opacity: pressed ? 0.8 : 1 },
          !isBiddingActive && styles.auctionButtonInactive,
        ]}
        disabled={loading}
      >
        <Text style={styles.auctionButtonText}>
          {isBiddingActive ? "ENTER LIVE AUCTION" : "VIEW AUCTION DETAILS"}
        </Text>
        <View style={styles.timerContainer}>
          <Text
            style={[
              styles.timerText,
              isBiddingActive
                ? styles.timerTextActive
                : styles.timerTextInactive,
            ]}
          >
            {getStatusText()}
          </Text>
        </View>
      </Pressable>
      <View style={styles.separator} />
      <Text style={styles.enthusiasmText}>
        Ignite your passion, claim the road.
      </Text>
      <Pressable
        onPress={handleLinkedInPress}
        style={({ pressed }) => [
          styles.linkedInButton,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Text style={styles.linkedInButtonText}>
          Connect with the Developer on LinkedIn
        </Text>
      </Pressable>
      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.logoutButton,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </Pressable>
    </View>
  );
};

export default LandingScreen;
