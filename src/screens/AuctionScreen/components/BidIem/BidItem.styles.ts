// BidItem.styles.ts
import { ScaledSheet } from "react-native-size-matters";
import { COLORS } from "../../../../constant/COLORS";
import { FontFamilies } from "../../../../Fonts/Fonts";

const styles = ScaledSheet.create({
  bidderItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: "10@vs",
    paddingHorizontal: "5@s",
    borderBottomWidth: 1,
    borderColor: COLORS.CARD_BACKGROUND,
  },

  bidderName: {
    fontSize: "14@ms",
    fontFamily: FontFamilies.medium,
    color: COLORS.PRIMARY_BLACK,
  },

  userTag: {
    fontSize: "12@ms",
    fontFamily: FontFamilies.medium,
    color: COLORS.ACCENT_ORANGE,
  },

  bidderTime: {
    fontSize: "12@ms",
    fontFamily: FontFamilies.regular,
    color: COLORS.LIGHT_GRAY,
    marginTop: "2@vs",
  },

  bidderAmount: {
    fontSize: "16@ms",
    fontFamily: FontFamilies.bold,
    color: COLORS.ACCENT_ORANGE,
    alignSelf: "center",
  },
});

export default styles;
