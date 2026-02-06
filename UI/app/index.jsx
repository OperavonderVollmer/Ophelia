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
import { styles } from "./styles";
import { QuickCamera } from "../components/sub-components/quickCamera";

const Home = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400: Poppins_400Regular,
    Poppins_500: Poppins_500Medium,
    Poppins_600: Poppins_600SemiBold,
  });

  const [popup, setPopup] = React.useState(null);
  const [usingCamera, setUsingCamera] = React.useState(false);

  const handleNewPopup = React.useCallback((arr) => {
    let p = null;
    console.log("Arr:", arr);
    if (arr[1]) {
      console.log(`New popup: ${JSON.stringify(arr[0])}`);
      p = <DSLHelper payload={arr[0]} />;
    } else {
      console.log(arr[0] + " - " + arr[1]);
      p = arr[0];
    }
    console.log(p);
    setPopup(p);
  }, []);

  React.useEffect(() => {
    const unsubscribe = Emitter.subscribe("OPR:NewPopup", handleNewPopup);
    return () => unsubscribe();
  }, [handleNewPopup]);

  React.useEffect(() => {
    const unsubscribe = Emitter.subscribe("OPR:NewMenu", (payload) => {
      setPopup(payload);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    const unsubscribe = Emitter.subscribe("OPR:CloseForm", () => {
      setPopup(null);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    const unsubscribe = Emitter.subscribe("OPR:ScanQRCode", () => {
      setUsingCamera(true);
    });
    return () => unsubscribe();
  }, []);

  return (
    <React.Fragment>
      {usingCamera && <QuickCamera callback={() => setUsingCamera(false)} />}
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
