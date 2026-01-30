import React from "react";
import { View, Dimensions, Text, Button, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import Emitter from "../../helpers/Emitter";

export const QuickCamera = ({ callback }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = React.useState(false);
  const [window, setWindow] = React.useState(Dimensions.get("window"));

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWindow(Dimensions.get("window"));
    });
    return () => subscription?.remove();
  }, []);

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.18)",
        zIndex: 1000,
        display: "flex",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 20,
          borderRadius: 20,
        }}
      >
        <Text style={{ color: "white", fontSize: 30, marginBottom: 10 }}>
          Scan QR Code
        </Text>
        <Text
          style={{
            color: scanned ? "green" : "red",
            fontSize: 20,
          }}
        >
          {scanned ? "Scanned!" : "Not Scanned Yet"}
        </Text>

        <View
          style={{
            borderRadius: 20,
            borderWidth: 5,
            borderColor: "rgba(3, 3, 3, 0.8)",
            overflow: "hidden",
            height:
              window.height > window.width
                ? window.width * 0.8
                : window.height * 0.8,
            width:
              window.height > window.width
                ? window.width * 0.8
                : window.height * 0.8,
            backgroundColor: "white",
          }}
        >
          {!permission || !permission?.granted ? (
            <View>
              <Text>Camera permission not granted</Text>
              <TouchableOpacity
                onPress={() => {
                  if (!permission || !permission.granted) {
                    requestPermission();
                  }
                }}
              >
                <Text>Request Permission</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <CameraView
              style={{
                flex: 1,
                objectFit: "cover",
                justifyContent: "center",
                alignItems: "center",
              }}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={(result) => {
                if (!result.data) return;
                if (scanned) return;

                console.log("Scanned QR Code:", result.data);
                setScanned(true);
                Emitter.setState("OPR:QRCodeScanned", result.data);

                callback();
              }}
            />
          )}
        </View>
        <TouchableOpacity onPress={() => callback()}>
          <Text style={{ color: "white", fontSize: 20 }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
