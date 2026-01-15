import React from "react";
import { Text, TouchableOpacity, Dimensions } from "react-native";
import { styles, gradientColors } from "../../app/styles";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

const bigButtonWithIconComponent = ({
  icon,
  text,
  onPress,
  index,
  selectedMenu,
  height = 80,
  width = 80,
}) => {
  const [selected, setSelected] = React.useState(false);
  const [window, setWindow] = React.useState(Dimensions.get("window"));

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWindow(Dimensions.get("window"));
    });
    return () => subscription?.remove();
  }, []);

  return (
    <LinearGradient
      colors={
        selectedMenu === index
          ? gradientColors
          : ["rgba(255, 255, 255, 0.7)", "rgba(255, 255, 255, 0.7)"]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
        borderRadius: 10,
        alignSelf: "flex-start",
        opacity: 1,
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "rgb(5, 5, 5)",
          width:
            selectedMenu === index ? (window.width < 750 ? 220 : 330) : 160,
          height: 160,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          onPress();
        }}
      >
        <Svg
          width={width}
          height={height}
          viewBox="0 0 24 24"
          fill="none"
          stroke={
            selectedMenu === index
              ? "rgba(255, 255, 255, 1)"
              : "rgba(255, 255, 255, 0.8)"
          }
          strokeWidth={1}
        >
          {icon}
        </Svg>

        <Text
          style={[
            styles.controlButtontext,
            {
              fontSize: 20,
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          {text}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default bigButtonWithIconComponent;
