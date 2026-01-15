import { View, Text } from "react-native";

export const InterfaceDiscoverySubComponent = ({ instruction, content }) => {
  return (
    <View
      style={{
        padding: 10,
        borderRadius: 10,
        justifyContent: "flex-start",
        alignSelf: "stretch",
      }}
    >
      <Text style={{ color: "white", fontSize: 30, marginBottom: 10 }}>
        Instructions
      </Text>
      <Text
        style={{
          color: "white",
          fontSize: 15,
          marginLeft: 15,
          marginBottom: 60,
        }}
      >
        {instruction}
      </Text>
      {content}
    </View>
  );
};
