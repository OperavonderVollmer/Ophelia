import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../app/styles";

const bigButtonWithIconComponent = ({ icon, text, onPress }) => {
  return (
    <View
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
          width: 160,
          height: 160,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          onPress();
        }}
      >
        {icon}
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
    </View>
  );
};

export default bigButtonWithIconComponent;
