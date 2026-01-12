import { StyleSheet } from "react-native";

export const gradientColors = ["rgba(255, 0, 0, 1)", "rgba(0, 17, 255, 1)"];

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 10,
  },
  pluginContent: {
    padding: 20,
    flexDirection: "column",
  },
  controlButton: {
    marginLeft: 10,
    backgroundColor: "rgba(0, 0, 0, 0.77)",
    padding: 5,
    borderRadius: 5,
    borderColor: "rgba(255, 255, 255, 0.7)",
    borderWidth: 2,
    borderStyle: "solid",
  },
  controlButtontext: {
    color: "rgba(255, 255, 255, 1)",
    fontSize: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  controlButtonSVG: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  basicButton: {
    padding: 2, // the gradient border thickness
    borderRadius: 8,
    marginBottom: 10,
  },
  basicButtonInner: {
    backgroundColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
  basicButtonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: "white",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
