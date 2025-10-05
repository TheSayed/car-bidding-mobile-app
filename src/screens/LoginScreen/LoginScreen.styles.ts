import { ScaledSheet } from "react-native-size-matters";
import { COLORS } from "../../constant/COLORS";
import { FontFamilies } from "../../Fonts/Fonts";

export default ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY_BLACK,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "40@s",
  },
  appName: {
    fontSize: "48@ms",
    fontFamily: FontFamilies.bold,
    color: COLORS.ACCENT_ORANGE,
    letterSpacing: 2,
  },
  sloganText: {
    fontSize: "16@ms",
    fontFamily: FontFamilies.regular,
    color: COLORS.WHITE,
    marginBottom: "50@vs",
    letterSpacing: 1,
  },
  promptHeader: {
    fontSize: "18@ms",
    fontFamily: FontFamilies.medium,
    marginBottom: "15@vs",
    textAlign: "center",
    color: COLORS.WHITE,
  },
  input: {
    width: "100%",
    height: "55@vs",
    borderColor: COLORS.LIGHT_GRAY,
    borderWidth: "1@s",
    borderRadius: "10@s",
    paddingHorizontal: "15@s",
    marginBottom: "30@vs",
    backgroundColor: "#333333",
    color: COLORS.WHITE,
    fontSize: "16@ms",
    fontFamily: FontFamilies.regular,
  },
  button: {
    width: "100%",
    height: "55@vs",
    borderRadius: "10@s",
    backgroundColor: COLORS.ACCENT_ORANGE,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.ACCENT_ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: "18@ms",
    fontFamily: FontFamilies.bold,
  },
  infoText: {
    marginTop: "25@vs",
    fontSize: "12@ms",
    textAlign: "center",
    color: COLORS.LIGHT_GRAY,
    fontFamily: FontFamilies.regular,
  },
});
