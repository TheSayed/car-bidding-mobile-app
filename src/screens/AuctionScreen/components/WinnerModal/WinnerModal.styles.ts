import { ScaledSheet } from "react-native-size-matters";
import { COLORS } from "../../../../constant/COLORS";
import { FontFamilies } from "../../../../Fonts/Fonts";

const styles = ScaledSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.BlackOpacity,
    justifyContent: "center",
    alignItems: "center",
    padding: "20@s",
  },

  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: "20@s",
    padding: "30@s",
    alignItems: "center",
    width: "90%",
    maxWidth: 400, // keep maxWidth as static for large screens
    shadowColor: COLORS.PRIMARY_BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: "8@s",
    elevation: 8,
  },

  modalTitle: {
    fontSize: "28@ms",
    color: COLORS.PRIMARY_BLACK,
    marginBottom: "12@vs",
    textAlign: "center",
    fontFamily: FontFamilies.bold,
  },

  modalMessage: {
    fontSize: "18@ms",
    color: COLORS.TEXT_DARK,
    textAlign: "center",
    marginBottom: "8@vs",
    lineHeight: "24@vs",
    fontFamily: FontFamilies.regular,
  },

  modalBidAmount: {
    fontSize: "24@ms",
    color: COLORS.ACCENT_ORANGE,
    marginTop: "12@vs",
    marginBottom: "16@vs",
    textAlign: "center",
    fontFamily: FontFamilies.bold,
  },

  modalCountdown: {
    fontSize: "14@ms",
    color: COLORS.GRAY,
    marginBottom: "20@vs",
    textAlign: "center",
    fontStyle: "italic",
    fontFamily: FontFamilies.medium,
  },

  modalButton: {
    backgroundColor: COLORS.ACCENT_ORANGE,
    paddingVertical: "14@vs",
    paddingHorizontal: "40@s",
    borderRadius: "12@s",
    width: "100%",
    alignItems: "center",
    shadowColor: COLORS.ACCENT_ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: "6@s",
    elevation: 4,
  },

  modalButtonText: {
    color: COLORS.WHITE,
    fontSize: "16@ms",
    letterSpacing: 0.5,
    fontFamily: FontFamilies.bold,
  },
});

export default styles;
