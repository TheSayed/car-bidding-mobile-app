import React from "react";
import { View, Text, Image } from "react-native";
import styles from "./AuctionHeader.styles";
import { LinearGradient } from "expo-linear-gradient";
import { INITIAL_PRODUCT_DATA } from "../../../../constant/auctionData";

interface AuctionHeaderProps {
  productName: string;
  userName: string;
  currentAuctionId: string | null;
}

const AuctionHeader: React.FC<AuctionHeaderProps> = ({
  productName,
  userName,
}) => {
  return (
    <>
      {/* Product Section */}
      <View>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={INITIAL_PRODUCT_DATA.productImage}
          />
        </View>

        {/* Product Name BELOW image with gradient background */}
        <LinearGradient
          colors={["#1E3A8A", "#2563EB", "#60A5FA"]} // deep → bright blue
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.productNameContainer}
        >
          <Text style={styles.productText}>{productName}</Text>
        </LinearGradient>
      </View>

      {/* User Header */}
      <View style={styles.userHeader}>
        <Text style={styles.userNameText}>
          Logged in as: <Text style={styles.userTag}>{userName}</Text>
        </Text>
      </View>
    </>
  );
};

export default AuctionHeader;
