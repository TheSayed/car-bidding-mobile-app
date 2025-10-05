import React from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
// Ensure the styles are correctly defined in this file
import { COLORS } from "../../../../constant/COLORS";
import { BID_INCREMENTS } from "../../../../constant/auctionData"; // Ensure the increments are correctly defined
import styles from "./BidsControls.styles";

interface BidControlsProps {
  selectedIncrement: number;
  isBidding: boolean;
  ctaDisabled: boolean;
  ctaText: string;
  currentBid: number;
  onSelectIncrement: (increment: number) => void;
  onPlaceBid: () => void;
}

const BidControls: React.FC<BidControlsProps> = ({
  selectedIncrement,
  isBidding,
  ctaDisabled,
  ctaText,
  currentBid,
  onSelectIncrement,
  onPlaceBid,
}) => {
  return (
    <View style={styles.footer}>
      {/* Bid Increments */}
      <View style={styles.biddingChoicesContainer}>
        {BID_INCREMENTS.map((increment) => (
          <TouchableOpacity
            key={increment}
            onPress={() => onSelectIncrement(increment)}
            disabled={ctaDisabled}
            style={[
              styles.biddingItemButton,
              selectedIncrement === increment && styles.selectedBidButton,
              ctaDisabled && { opacity: 0.5 },
            ]}
          >
            <Text
              style={[
                styles.biddingItemText,
                selectedIncrement === increment && styles.selectedBidText,
              ]}
            >
              +${(increment / 1000).toLocaleString()}K
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA Button */}
      <Pressable
        onPress={onPlaceBid}
        disabled={ctaDisabled || isBidding}
        style={[
          styles.ctaButton,
          ctaDisabled || isBidding ? styles.ctaDisabled : styles.ctaActive,
        ]}
      >
        {isBidding ? (
          <ActivityIndicator color={COLORS.WHITE} />
        ) : (
          <Text style={styles.ctaText}>{ctaText}</Text>
        )}
      </Pressable>
    </View>
  );
};

export default BidControls;
