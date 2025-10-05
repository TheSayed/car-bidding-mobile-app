import { ScaledSheet } from "react-native-size-matters";
import { COLORS } from "../../../../constant/COLORS";
import { FontFamilies } from "../../../../Fonts/Fonts";

export default ScaledSheet.create({
  imageContainer: {
    width: "100%",
    height: "180@vs",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  productNameContainer: {
    backgroundColor: COLORS.PRIMARY_BLACK,
    paddingVertical: "6@vs",
    opacity: 0.9,
    shadowColor: COLORS.PRIMARY_BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },

  productText: {
    fontSize: "24@ms",
    fontFamily: FontFamilies.bold,
    textAlign: "center",
    color: COLORS.WHITE,
  },
  userHeader: {
    padding: "10@s",
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderBottomWidth: 1,
    borderColor: COLORS.DIVIDER_GRAY,
  },
  userNameText: {
    fontSize: "14@ms",
    fontFamily: FontFamilies.medium,
    color: COLORS.PRIMARY_BLACK,
  },
  userTag: {
    fontSize: "14@ms",
    fontFamily: FontFamilies.medium,
    color: COLORS.ACCENT_ORANGE,
  },
});
