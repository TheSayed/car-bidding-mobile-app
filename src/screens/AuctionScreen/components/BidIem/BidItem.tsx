// BidItem.tsx
import { memo } from "react";
import { Text, View } from "react-native";
import styles from "./BidItem.styles"; // importing from new styles file

export const BidItem = memo(
  ({ item, isCurrentUser }: { item: any; isCurrentUser: boolean }) => (
    <View style={styles.bidderItemRow}>
      <View>
        <Text style={styles.bidderName}>
          {item.userName}
          {isCurrentUser && <Text style={styles.userTag}> (You)</Text>}
        </Text>
      </View>
      <Text style={styles.bidderAmount}>${item.amount.toLocaleString()}</Text>
    </View>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.isCurrentUser === nextProps.isCurrentUser
    );
  }
);

BidItem.displayName = "BidItem";
