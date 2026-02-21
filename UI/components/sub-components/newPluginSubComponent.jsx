import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { styles } from "../../app/styles";

export const NewPluginSubComponent = ({ plugin }) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(true);
  const pluginStyles = StyleSheet.create({
    span: {
      color: "rgb(141, 141, 141)",
      fontSize: 11,
    },
    button: {
      backgroundColor: "rgba(20, 2, 32, 0.77)",
      paddingVertical: 5,
      paddingHorizontal: 15,
    },
  });

  return (
    <View
      style={{
        padding: 10,
        marginVertical: 3,
        borderRadius: 10,
        borderColor: "white",
        borderWidth: 1,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      }}
      key={plugin.name}
    >
      {/* <TouchableOpacity
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          padding: 5,
          alignSelf: "flex-end",
          height: 30,
          width: 30,
          backgroundColor: dropdownOpen
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(255, 255, 255, 0.0)",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
        onPress={() => setDropdownOpen(!dropdownOpen)}
      >
        <Svg
          width={15}
          height={15}
          viewBox="0 0 24 24"
          fill={
            dropdownOpen
              ? "rgba(255, 255, 255, 0.9)"
              : "rgba(255, 255, 255, 0.8)"
          }
          style={{
            transform: [{ rotate: dropdownOpen ? "0deg" : "90deg" }],
          }}
        >
          <Path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.813 11.406l-7.906 9.906c-0.75 0.906-1.906 0.906-2.625 0l-7.906-9.906c-0.75-0.938-0.375-1.656 0.781-1.656h16.875c1.188 0 1.531 0.719 0.781 1.656z"
          />
        </Svg>
      </TouchableOpacity> */}
      <Text style={{ color: "white" }}>
        <span style={pluginStyles.span}>Plugin</span> {plugin.name}
      </Text>
      {dropdownOpen && (
        <View style={{  }}>
          <Text style={{ color: "white", textAlign: "justify" }}>
            <span style={pluginStyles.span}>Description</span>{" "}
            {plugin.description}
          </Text>
          <Text style={{ color: "white" }}>
            <span style={pluginStyles.span}>Last Update</span>{" "}
            {plugin.last_update_date}
          </Text>
          <Text style={{ color: "white" }}>
            <span style={pluginStyles.span}>Status</span>{" "}
            {plugin?.status || "Not installed"}
          </Text>
        </View>
      )}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          marginTop: 10,
        }}
      >
        {plugin.topics
          .filter((topic) => topic !== "opr-oph-plugin")
          .map((topic) => (
            <Text
              key={topic}
              style={{
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                paddingHorizontal: 8,
                textAlign: "center",
                borderRadius: 5,
                fontSize: 10,
                paddingVertical: 5,
                // fontStyle: "italic",
                fontWeight: 600,
              }}
            >
              {topic}
            </Text>
          ))}
      </View>
      <View style={{ marginTop: 10, flexDirection: "row-reverse" }}>
        <TouchableOpacity
          style={[styles.controlButton, pluginStyles.button]}
          onPress={() => {
            console.log(
              `Uninstalling plugin ${plugin.name} from ${plugin.clone_url}`,
            );
          }}
        >
          <Text style={styles.controlButtontext}>Uninstall</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, pluginStyles.button]}
          onPress={() => {
            console.log(
              `Installing plugin ${plugin.name} from ${plugin.clone_url}`,
            );
          }}
        >
          <Text style={styles.controlButtontext}>Install</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewPluginSubComponent;
