import { ScaledSheet } from "react-native-size-matters";
import { COLORS } from "../../../../constant/COLORS";
import { FontFamilies } from "../../../../Fonts/Fonts";

export default ScaledSheet.create({
  infoHeader: {
    paddingHorizontal: "8@ms",
    paddingTop: "10@vs",
    backgroundColor: COLORS.WHITE,
  },

  // Timer States
  timeActive: {
    fontFamily: FontFamilies.bold,
    color: COLORS.GREEN_SUCCESS,
  },
  timeCooldown: {
    fontFamily: FontFamilies.bold,
    color: COLORS.RED_LIVE,
  },
  circleActive: {
    backgroundColor: COLORS.RED_LIVE,
    shadowColor: COLORS.RED_LIVE,
  },
  circleInactive: {
    backgroundColor: COLORS.DIVIDER_GRAY,
    shadowColor: COLORS.DIVIDER_GRAY,
  },

  bidHistoryTitle: {
    fontSize: "16@ms",
    fontFamily: FontFamilies.bold,
    color: COLORS.PRIMARY_BLACK,
    marginBottom: "5@vs",
    marginTop: "5@vs",
  },

  biddingInfo: {
    flexDirection: "row",
    backgroundColor: COLORS.WHITE,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: "8@vs",
    borderRadius: "12@s",
    borderWidth: 1,
    borderColor: COLORS.DIVIDER_GRAY,
    marginBottom: "15@vs",
    shadowColor: COLORS.PRIMARY_BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  startBiddingContainer: {
    alignItems: "flex-start",
    paddingRight: "10@s",
  },
  startBiddingText: {
    fontSize: "12@ms",
    fontFamily: FontFamilies.regular,
    color: COLORS.LIGHT_GRAY,
  },
  bidAmountText: {
    fontSize: "22@ms",
    fontFamily: FontFamilies.bold,
    color: COLORS.PRIMARY_BLACK,
    marginTop: "3@vs",
  },
  highlightBid: {
    color: COLORS.ACCENT_ORANGE,
  },

  liveBiddersContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "8@vs",
  },
  liveBiddersLabel: {
    fontSize: "12@ms",
    fontFamily: FontFamilies.regular,
    color: COLORS.LIGHT_GRAY,
  },
  liveBiddersValue: {
    fontSize: "12@ms",
    fontFamily: FontFamilies.bold,
    color: COLORS.PRIMARY_BLACK,
  },

  currentBidContainer: {
    alignItems: "flex-start",
    paddingLeft: "10@s",
  },
  separator: {
    height: "80%",
    backgroundColor: COLORS.DIVIDER_GRAY,
    width: "1@s",
    borderRadius: "0.5@s",
  },
  timerIcon: {
    marginRight: "5@s",
  },

  auctionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "5@vs",
    marginBottom: "5@vs",
    borderBottomWidth: 1,
    borderColor: COLORS.DIVIDER_GRAY,
  },
  liveAuctionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: "10@s",
    height: "10@s",
    borderRadius: "5@s",
    backgroundColor: COLORS.ACCENT_ORANGE,
    marginRight: "8@s",
    shadowColor: COLORS.ACCENT_ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
  },
  liveAuctionText: {
    fontSize: "16@ms",
    fontFamily: FontFamilies.bold,
    color: COLORS.PRIMARY_BLACK,
  },
  bidsMadeText: {
    fontSize: "14@ms",
    fontFamily: FontFamilies.regular,
    color: COLORS.LIGHT_GRAY,
  },
});
