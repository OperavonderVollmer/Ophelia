import React, { useCallback } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import InputComponent from "../components/inputComponent";
import Emitter from "../helpers/Emitter";
import { DSLHelper } from "../helpers/DSLHelper";
import { ws } from "../helpers/WebSocketServer";
import PluginSelection from "../components/pluginSelection";
import { useFonts } from "expo-font";
import Svg, { Path } from "react-native-svg";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

const Home = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400: Poppins_400Regular,
    Poppins_500: Poppins_500Medium,
    Poppins_600: Poppins_600SemiBold,
  });

  const [popup, setPopup] = React.useState(null);

  const handleNewPopup = React.useCallback((payload) => {
    console.log(`New popup: ${JSON.stringify(payload)}`);
    const p = <DSLHelper payload={payload} />;
    console.log(p);
    setPopup(p);
  }, []);

  React.useEffect(() => {
    const unsubscribe = Emitter.subscribe("OPR:NewPopup", handleNewPopup);
    return () => unsubscribe();
  }, [handleNewPopup]);

  React.useEffect(() => {
    const unsubscribe = Emitter.subscribe("OPR:CloseForm", () => {
      setPopup(null);
    });
    return () => unsubscribe();
  }, []);

  const [styles, setStyles] = React.useState(
    StyleSheet.create({
      container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: 10,
      },
      controlButton: {
        marginLeft: 10,
        backgroundColor: "rgba(0, 0, 0, 0.77)",
        padding: 5,
        borderRadius: 5,
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 2,
        borderStyle: "solid",
      },
      controlButtontext: {
        color: "rgba(255, 255, 255, 1)",
        fontSize: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      },
      controlButtonSVG: {
        width: 20,
        height: 20,
        marginRight: 5,
      },
    })
  );

  return (
    <React.Fragment>
      <LinearGradient
        colors={["rgba(36, 36, 36, 1)", "rgba(17, 17, 17, 1)"]}
        start={{ x: 0.5, y: 0 }} // top center
        end={{ x: 0.5, y: 1 }} // bottom center
        style={styles.container}
      >
        <View
          style={{ alignItems: "center", flexDirection: "row", marginTop: 30 }}
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
                  fill="rgba(255, 255, 255, 0.8)" // adjust to taste
                />
              </Svg>
              <Text style={[styles.controlButtontext, { marginLeft: 5 }]}>
                Plugins
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <PluginSelection />
      </LinearGradient>
      {popup ? <InputComponent payload={popup} /> : null}
      {/* <InputComponent /> */}
    </React.Fragment>
  );
};

export default Home;
