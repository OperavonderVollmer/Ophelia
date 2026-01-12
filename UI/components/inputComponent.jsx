import { View, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const InputComponent = ({ payload }) => {
  const [window, setWindow] = React.useState(Dimensions.get("window"));

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWindow(Dimensions.get("window"));
    });
    return () => subscription?.remove();
  }, []);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        outer: {
          position: "absolute",
          backgroundColor: "rgb(0, 0, 0)",
          zIndex: 999,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        },
        inner: {
          padding: 10,
          borderRadius: 10,
          borderWidth: 3,
          borderColor: "rgba(206, 206, 206, 0.78)",
          width: Math.max(window.width * 0.5, 300),
          height: Math.max(window.height * 0.8, 400),
        },
      }),
    [window] // <-- recalc styles when window changes
  );

  return (
    <View style={styles.outer}>
      <LinearGradient
        colors={["rgba(18, 7, 39, .7)", "rgba(27, 2, 2, .7)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.inner}
      >
        {payload}
      </LinearGradient>
    </View>
  );
};

export default InputComponent;
