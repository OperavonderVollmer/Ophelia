import React from "react";
import { View, Dimensions, Text, Button, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import Emitter from "../../helpers/Emitter";

export const QuickCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [usingCamera, setUsingCamera] = React.useState(false);
  const [scanned, setScanned] = React.useState(false);
  const [window, setWindow] = React.useState(Dimensions.get("window"));

  React.useEffect(() => {
    if (scanned) {
    }
  }, [scanned]);

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWindow(Dimensions.get("window"));
    });
    return () => subscription?.remove();
  }, []);

  React.useEffect(() => {
    const unsubscribe = Emitter.subscribe("OPR:ScanQRCode", () => {
      setUsingCamera(true);
    });
    return () => unsubscribe();
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
        zIndex: usingCamera ? 1000 : -1,
        display: usingCamera ? "flex" : "none",
        // zIndex: 1000,
        // display: "flex",
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
                  console.log("Requesting permission...");
                  if (!permission || !permission.granted) {
                    requestPermission();
                    console.log("Requesting permission 2...");
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
                // aspectRatio: 1,
                objectFit: "cover", // WEB ONLY, but harmless on native
                justifyContent: "center",
                alignItems: "center",
              }}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={(result) => {
                if (result.data) {
                  console.log("Scanned QR Code:", result.data);
                  setScanned(true);
                  // setUsingCamera(false); // commented for now
                  Emitter.setState("OPR:QRCodeScanned", result.data);
                }
              }}
            />
          )}
        </View>
        <TouchableOpacity onPress={() => setUsingCamera(false)}>
          <Text style={{ color: "white", fontSize: 20 }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
