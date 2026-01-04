import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import InputComponent from "../components/inputComponent";
import Emitter from "../helpers/Emitter";
import { DSLHelper } from "../helpers/DSLHelper";
import { ws } from "../helpers/WebSocketServer";
import PluginSelection from "../components/pluginSelection";
import TopBarComponent from "../components/topBarComponent";
import { useFonts } from "expo-font";
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
        <TopBarComponent styles={styles} />

        <PluginSelection />
      </LinearGradient>
      {popup ? <InputComponent payload={popup} /> : null}
      {/* <InputComponent /> */}
    </React.Fragment>
  );
};

export default Home;
