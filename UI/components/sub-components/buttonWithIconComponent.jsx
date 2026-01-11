import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const ButtonWithIconComponent = ({ styles, icon, text, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
    >
      <View
        style={[
          styles.controlButton,
          { flexDirection: "row", alignItems: "center" },
        ]}
      >
        {icon}
        <Text style={[styles.controlButtontext, { marginLeft: 5 }]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ButtonWithIconComponent;
