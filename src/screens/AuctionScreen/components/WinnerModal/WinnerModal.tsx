import React from "react";
import { View, Text, Modal, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./WinnerModal.styles";
import { COLORS } from "../../../../constant/COLORS";

interface WinnerModalProps {
  visible: boolean;
  isWinner: boolean;
  userName: string;
  winnerName: string;
  winningBid: string;
  countdown: number;
  onBackToLanding: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({
  visible,
  isWinner,
  userName,
  winnerName,
  winningBid,
  countdown,
  onBackToLanding,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <MaterialCommunityIcons
            name={isWinner ? "trophy" : "gavel"}
            size={80}
            color={isWinner ? COLORS.ACCENT_ORANGE : COLORS.PRIMARY_BLACK}
            style={{ marginBottom: 20 }}
          />

          {isWinner ? (
            <>
              <Text style={styles.modalTitle}>Congratulations!</Text>
              <Text style={styles.modalMessage}>
                {userName}, you won the auction!
              </Text>
              <Text style={styles.modalBidAmount}>
                Winning Bid: ${winningBid}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.modalTitle}>Auction Ended</Text>
              <Text style={styles.modalMessage}>
                {winnerName === "No one"
                  ? "No bids were placed in this auction"
                  : `${winnerName} won the auction`}
              </Text>
              {winnerName !== "No one" && (
                <Text style={styles.modalBidAmount}>
                  Winning Bid: ${winningBid}
                </Text>
              )}
            </>
          )}

          <Text style={styles.modalCountdown}>
            New auction starting in {countdown}s...
          </Text>

          <Pressable onPress={onBackToLanding} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Back to Landing</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default WinnerModal;
