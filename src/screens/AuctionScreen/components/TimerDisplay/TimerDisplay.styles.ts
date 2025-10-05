import { ScaledSheet } from "react-native-size-matters";
import { FontFamilies } from "../../../../Fonts/Fonts";

export default ScaledSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: "4@s",
  },
  text: {
    fontSize: "14@ms",
    fontFamily: FontFamilies.bold,
  },
});
