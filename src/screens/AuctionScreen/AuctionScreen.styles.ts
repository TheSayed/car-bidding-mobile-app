// CleanedUpStyles.ts
import { ScaledSheet } from "react-native-size-matters";
import { COLORS } from "../../constant/COLORS";
import { FontFamilies } from "../../Fonts/Fonts";

export default ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
  },

  bidListContent: {
    paddingTop: "10@vs",
    paddingBottom: "130@vs", // match footer height
    paddingHorizontal: "16@ms",
  },
});
