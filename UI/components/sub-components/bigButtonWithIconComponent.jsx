import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles, gradientColors } from "../../app/styles";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

const bigButtonWithIconComponent = ({
  icon,
  text,
  onPress,
  index,
  selectedMenu,
}) => {
  const [selected, setSelected] = React.useState(false);
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
          width: selectedMenu === index ? 320 : 160,
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
          width={80}
          height={80}
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
