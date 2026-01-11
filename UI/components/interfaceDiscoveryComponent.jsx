import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import InputComponent from "./inputComponent";

const InterfaceDiscoveryComponent = () => {
  const [popup, setPopup] = React.useState(null);

  return (
    <View>
      <Text>InterfaceDiscoveryComponent</Text>
      <TouchableOpacity>
        <Text
          onPress={() =>
            setPopup(
              <View>
                <Text>First</Text>
              </View>
            )
          }
        >
          First Button
        </Text>
        <Text
          onPress={() =>
            setPopup(
              <View>
                <Text>Second</Text>
              </View>
            )
          }
        >
          Second Button
        </Text>
        <Text
          onPress={() =>
            setPopup(
              <View>
                <Text>Third</Text>
              </View>
            )
          }
        >
          Third Button
        </Text>
      </TouchableOpacity>
      {popup ? (
        <View style={{ zIndex: 999 }}>
          {<InputComponent payload={popup} />}
        </View>
      ) : null}
    </View>
  );
};

export default InterfaceDiscoveryComponent;
