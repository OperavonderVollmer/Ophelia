import React from "react";
import { TouchableOpacity, StyleSheet, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Emitter from "../helpers/Emitter";
import { styles, gradientColors } from "../app/styles";

const PluginSelection = () => {
  const [plugins, setPlugins] = React.useState([]);
  const [serverStatus, setServerStatus] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = Emitter.subscribe("OPR:UpdatePlugins", (payload) => {
      console.log(`Received plugins: ${JSON.stringify(payload)}`);

      if (payload[0].length !== 0) {
        setPlugins(payload[0]);
      } else {
        setPlugins([]);
      }
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    const unsubscribe = Emitter.subscribe("OPR:Online", (status) => {
      setServerStatus(status);
    });
    return () => unsubscribe();
  }, []);

  const noPluginsMessage = React.useMemo(() => {
    // If Server is offline, ask to reconnect
    // If Server is online but no plugins, ask to install plugins
    // If Server is online and has plugins, don't show message
    if (!serverStatus) {
      return "Disconnected from Ophelia, please connect";
    }
    if (serverStatus && plugins.length === 0) {
      return "No plugins installed, please install plugins";
    }
    return "";
  });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={styles.pluginContent}
    >
      <Text
        style={{
          fontWeight: "bold",
          paddingBottom: 10,
          color: "rgba(255, 255, 255, 0.77)",
        }}
      >
        Select a plugin
      </Text>
      <>
        {plugins.length > 0 ? (
          plugins.map((plugin) => (
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.basicButton}
            >
              <TouchableOpacity
                key={plugin}
                style={styles.basicButtonInner}
                onPress={() =>
                  Emitter.publish("OPR:RequestInputScheme", [plugin])
                }
              >
                <Text style={styles.basicButtonText}>{plugin}</Text>
              </TouchableOpacity>
            </LinearGradient>
          ))
        ) : (
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              fontStyle: "italic",
              fontFamily: "Cinzel",
              color: "rgba(255, 255, 255, 1)",
            }}
          >
            {noPluginsMessage}
          </Text>
        )}
      </>
    </ScrollView>
  );
};

export default PluginSelection;
