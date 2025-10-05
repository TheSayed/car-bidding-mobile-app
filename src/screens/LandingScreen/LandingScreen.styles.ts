import { ScaledSheet } from "react-native-size-matters";
import { COLORS } from "../../constant/COLORS";
import { FontFamilies } from "../../Fonts/Fonts";

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY_BACKGROUND,
    padding: "20@s",
    alignItems: "center",
    justifyContent: "center",
  },

  headerContainer: {
    marginBottom: "40@vs",
    width: "100%",
    alignItems: "center",
  },

  welcomeText: {
    fontSize: "24@ms",
    color: COLORS.TEXT_LIGHT,
    marginBottom: "5@vs",
    fontFamily: FontFamilies.regular,
  },

  nameHighlight: {
    fontFamily: FontFamilies.bold,
    color: COLORS.ACCENT_ORANGE,
  },

  sloganText: {
    fontSize: "16@ms",
    color: COLORS.GRAY,
    textAlign: "center",
    marginTop: "10@vs",
    fontFamily: FontFamilies.regular,
  },

  // --- Auction CTA Styles ---
  auctionButton: {
    width: "90%",
    backgroundColor: COLORS.ACCENT_ORANGE,
    borderRadius: "12@s",
    paddingVertical: "50@vs",
    paddingHorizontal: "20@s",
    marginBottom: "20@vs",
    elevation: 5,
  },

  auctionButtonInactive: {
    backgroundColor: COLORS.SECONDARY_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
  },

  auctionButtonText: {
    fontSize: "18@ms",
    color: COLORS.TEXT_DARK,
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: "5@vs",
    fontFamily: FontFamilies.bold,
  },

  timerContainer: {
    marginTop: "5@vs",
    alignItems: "center",
  },

  timerText: {
    fontSize: "14@ms",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontFamily: FontFamilies.medium,
  },

  timerTextActive: {
    color: COLORS.TEXT_DARK,
  },

  timerTextInactive: {
    color: COLORS.GRAY,
  },

  // --- Live Data Panel Styles ---
  liveDataPanel: {
    width: "90%",
    padding: "15@s",
    borderRadius: "10@s",
    backgroundColor: COLORS.SECONDARY_BACKGROUND,
    marginBottom: "30@vs",
    borderWidth: 1,
    borderColor: COLORS.GRAY,
  },

  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: "5@vs",
  },

  dataLabel: {
    fontSize: "16@ms",
    color: COLORS.GRAY,
    fontFamily: FontFamilies.regular,
  },

  dataValue: {
    fontSize: "16@ms",
    color: COLORS.TEXT_LIGHT,
    fontFamily: FontFamilies.bold,
  },

  // --- General Styles ---
  separator: {
    height: 1,
    width: "70%",
    backgroundColor: COLORS.SECONDARY_BACKGROUND,
    marginVertical: "25@vs",
  },

  enthusiasmText: {
    fontSize: "14@ms",
    color: COLORS.GRAY,
    fontStyle: "italic",
    marginBottom: "30@vs",
    fontFamily: FontFamilies.regular,
  },

  linkedInButton: {
    width: "90%",
    backgroundColor: COLORS.LINKEDIN_BLUE,
    borderRadius: "8@s",
    paddingVertical: "12@vs",
    marginBottom: "15@vs",
  },

  linkedInButtonText: {
    fontSize: "12@ms",
    color: COLORS.TEXT_LIGHT,
    textAlign: "center",
    fontFamily: FontFamilies.medium,
  },

  logoutButton: {
    width: "90%",
    borderRadius: "8@s",
    paddingVertical: "12@vs",
    borderWidth: 1,
    borderColor: COLORS.GRAY,
  },

  logoutButtonText: {
    fontSize: "14@ms",
    color: COLORS.GRAY,
    textAlign: "center",
    fontFamily: FontFamilies.medium,
  },
});

export default styles;
