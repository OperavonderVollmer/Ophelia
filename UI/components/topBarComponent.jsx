import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Dimensions } from "react-native";
import Emitter from "../helpers/Emitter";

const TopBarComponent = ({ styles }) => {
  const [isPhone, setIsPhone] = React.useState(
    Dimensions.get("window").width < 600
  );

  React.useEffect(() => {
    const onChange = ({ window }) => setIsPhone(window.width < 600);

    const subscription = Dimensions.addEventListener("change", onChange);

    return () => subscription?.remove();
  }, []);

  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        marginTop: isPhone ? 30 : 0,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontStyle: "italic",
          fontFamily: "Cinzel",
          color: "rgba(255, 255, 255, 0.77)",
        }}
      >
        Ophelia
      </Text>
      <TouchableOpacity
        onPress={() => {
          Emitter.publish("OPR:RequestPlugins");
        }}
      >
        <View
          style={[
            styles.controlButton,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth={1.5}
          >
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </Svg>

          <Text style={[styles.controlButtontext, { marginLeft: 5 }]}>
            Refresh
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          Emitter.publish("OPR:Refresh");
        }}
      >
        <View
          style={[
            styles.controlButton,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <Svg width={20} height={20} viewBox="0 0 16 16" fill="none">
            <Path
              d="M10 3.5L13.0581 0.441881C12.4304 0.15802 11.7337 0 11 0C8.23858 0 6 2.23858 6 5C6 5.45802 6.06158 5.90165 6.17692 6.32308L0 12.5L3.5 16L9.67692 9.82308C10.0983 9.93842 10.542 10 11 10C13.7614 10 16 7.76142 16 5C16 4.26633 15.842 3.56956 15.5581 2.94188L12.5 6H10V3.5Z"
              fill="rgba(255, 255, 255, 0.8)"
            />
          </Svg>
          <Text style={[styles.controlButtontext, { marginLeft: 5 }]}>
            Plugins
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          // Emitter.publish("OPR:Refresh");
        }}
      >
        <View
          style={[
            styles.controlButton,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <Svg width={20} height={20} viewBox="0 0 16 16" fill="none">
            <Path
              d="M5.5 5.5C5.5 4.11929 6.61929 3 8 3C9.38071 3 10.5 4.11929 10.5 5.5C10.5 6.88071 9.38071 8 8 8H7V11H8C11.0376 11 13.5 8.53757 13.5 5.5C13.5 2.46243 11.0376 0 8 0C4.96243 0 2.5 2.46243 2.5 5.5H5.5Z"
              fill="rgba(255, 255, 255, 0.8)"
            />
            <Path d="M10 13H7V16H10V13Z" fill="rgba(255, 255, 255, 0.8)" />
          </Svg>
          <Text style={[styles.controlButtontext, { marginLeft: 5 }]}>
            Help
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TopBarComponent;
