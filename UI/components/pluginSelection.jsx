import React from "react";
import { TouchableOpacity, StyleSheet, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Emitter from "../helpers/Emitter";

const PluginSelection = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: 20,
      flexDirection: "column",
    },
    buttonGradient: {
      padding: 2, // the gradient border thickness
      borderRadius: 8,
      marginBottom: 10,
    },
    buttonInner: {
      backgroundColor: "black",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
      height: 60,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      letterSpacing: 0.5,
      color: "white",
      textShadowColor: "rgba(0,0,0,0.3)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
  });

  const [plugins, setPlugins] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = Emitter.subscribe("OPR:UpdatePlugins", (payload) => {
      console.log(`Received plugins: ${JSON.stringify(payload)}`);
      setPlugins(payload);
    });
    return () => unsubscribe();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
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
              colors={["rgba(255, 0, 0, 1)", "rgba(0, 17, 255, 1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <TouchableOpacity
                key={plugin}
                style={styles.buttonInner}
                onPress={() =>
                  Emitter.publish("OPR:RequestInputScheme", plugin)
                }
              >
                <Text style={styles.buttonText}>{plugin}</Text>
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
            No plugins
          </Text>
        )}
      </>
    </ScrollView>
  );
};

export default PluginSelection;
