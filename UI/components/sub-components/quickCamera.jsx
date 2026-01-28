import React from "react";
import { View } from "react-native";
import { CameraView, Camera, useCameraPermissions } from "expo-camera";
import Emitter from "../../helpers/Emitter";

export const QuickCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [usingCamera, setUsingCamera] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = Emitter.subscribe("OPR:ScanQRCode", () => {
      setUsingCamera(true);
      if (permission && !permission.granted) {
        requestPermission();
        if (!permission.granted) {
          console.log("Camera permission not granted");
          return;
        }
      }
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
        backgroundColor: "rgba(43, 255, 0, 0.96)",
        zIndex: usingCamera ? 1000 : -1,
        display: usingCamera ? "flex" : "none",
      }}
    >
      <CameraView
        style={{ flex: 1, width: "50%", height: "auto" }}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={(result) => {
          if (result.data) {
            console.log("Scanned QR Code:", result.data);
            setScanned(result.data);
          }
        }}
      />
    </View>
  );
};
