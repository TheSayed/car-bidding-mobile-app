import { ScaledSheet } from "react-native-size-matters";
import { COLORS } from "../../../../constant/COLORS";
import { FontFamilies } from "../../../../Fonts/Fonts";

export default ScaledSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.WHITE,
    justifyContent: "center",
    paddingTop: "5@vs",
    paddingBottom: "30@vs",
    borderTopWidth: 1,
    borderColor: COLORS.DIVIDER_GRAY,
    shadowColor: COLORS.PRIMARY_BLACK,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  biddingChoicesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: "16@s",
    marginBottom: "10@vs",
  },
  biddingItemButton: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    paddingHorizontal: "12@s",
    paddingVertical: "5@vs",
    borderRadius: "8@s",
    minWidth: "70@s",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.DIVIDER_GRAY,
  },
  selectedBidButton: {
    backgroundColor: COLORS.ACCENT_ORANGE,
    borderColor: COLORS.ACCENT_ORANGE,
    shadowColor: COLORS.ACCENT_ORANGE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
    elevation: 5,
  },
  biddingItemText: {
    fontFamily: FontFamilies.bold,
    fontSize: "14@ms",
    color: COLORS.PRIMARY_BLACK,
  },
  selectedBidText: {
    color: COLORS.WHITE,
  },
  ctaButton: {
    paddingVertical: "15@vs",
    borderRadius: "10@s",
    marginHorizontal: "16@s",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: "8@s",
    elevation: 8,
  },
  ctaText: {
    color: COLORS.WHITE,
    fontSize: "18@ms",
    fontFamily: FontFamilies.bold,
    textAlign: "center",
  },
  ctaDisabled: {
    backgroundColor: COLORS.LIGHT_GRAY,
    shadowColor: COLORS.LIGHT_GRAY,
  },
  ctaActive: {
    backgroundColor: COLORS.ACCENT_ORANGE,
    shadowColor: COLORS.ACCENT_ORANGE,
  },
});
