import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Path, Circle } from "react-native-svg";
import BigButtonWithIconComponent from "./sub-components/bigButtonWithIconComponent";
import Emitter from "../helpers/Emitter";
import { LinearGradient } from "expo-linear-gradient";
import { InterfaceDiscoverySubComponent } from "./sub-components/interfaceDiscoverySubComponent";
import {
  launchImageLibraryAsync,
  launchCameraAsync,
  requestCameraPermissionsAsync,
} from "expo-image-picker";
import { CameraView, Camera, useCameraPermissions } from "expo-camera";

const InterfaceDiscoveryComponent = () => {
  const [icons, setIcons] = React.useState([
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 21H17M9 17V21M15 17V21M6.2 17H17.8C18.9201 17 19.4802 17 19.908 16.782C20.2843 16.5903 20.5903 16.2843 20.782 15.908C21 15.4802 21 14.9201 21 13.8V6.2C21 5.0799 21 4.51984 20.782 4.09202C20.5903 3.71569 20.2843 3.40973 19.908 3.21799C19.4802 3 18.9201 3 17.8 3H6.2C5.0799 3 4.51984 3 4.09202 3.21799C3.71569 3.40973 3.40973 3.71569 3.21799 4.09202C3 4.51984 3 5.07989 3 6.2V13.8C3 14.9201 3 15.4802 3.21799 15.908C3.40973 16.2843 3.71569 16.5903 4.09202 16.782C4.51984 17 5.07989 17 6.2 17Z"
    />,
    <>
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M23 4C23 2.34315 21.6569 1 20 1H16C15.4477 1 15 1.44772 15 2C15 2.55228 15.4477 3 16 3H20C20.5523 3 21 3.44772 21 4V8C21 8.55228 21.4477 9 22 9C22.5523 9 23 8.55228 23 8V4Z"
      />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M23 16C23 15.4477 22.5523 15 22 15C21.4477 15 21 15.4477 21 16V20C21 20.5523 20.5523 21 20 21H16C15.4477 21 15 21.4477 15 22C15 22.5523 15.4477 23 16 23H20C21.6569 23 23 21.6569 23 20V16Z"
      />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 21C3.44772 21 3 20.5523 3 20V16C3 15.4477 2.55228 15 2 15C1.44772 15 1 15.4477 1 16V20C1 21.6569 2.34315 23 4 23H8C8.55228 23 9 22.5523 9 22C9 21.4477 8.55228 21 8 21H4Z"
      />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M1 8C1 8.55228 1.44772 9 2 9C2.55228 9 3 8.55228 3 8V4C3 3.44772 3.44772 3 4 3H8C8.55228 3 9 2.55228 9 2C9 1.44772 8.55228 1 8 1H4C2.34315 1 1 2.34315 1 4V8Z"
      />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 6C11 5.44772 10.5523 5 10 5H6C5.44772 5 5 5.44772 5 6V10C5 10.5523 5.44772 11 6 11H10C10.5523 11 11 10.5523 11 10V6ZM9 7.5C9 7.22386 8.77614 7 8.5 7H7.5C7.22386 7 7 7.22386 7 7.5V8.5C7 8.77614 7.22386 9 7.5 9H8.5C8.77614 9 9 8.77614 9 8.5V7.5Z"
      />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 13C18.5523 13 19 13.4477 19 14V18C19 18.5523 18.5523 19 18 19H14C13.4477 19 13 18.5523 13 18V14C13 13.4477 13.4477 13 14 13H18ZM15 15.5C15 15.2239 15.2239 15 15.5 15H16.5C16.7761 15 17 15.2239 17 15.5V16.5C17 16.7761 16.7761 17 16.5 17H15.5C15.2239 17 15 16.7761 15 16.5V15.5Z"
      />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 5C13.4477 5 13 5.44772 13 6C13 6.55229 13.4477 7 14 7H16.5C16.7761 7 17 7.22386 17 7.5V10C17 10.5523 17.4477 11 18 11C18.5523 11 19 10.5523 19 10V6C19 5.44772 18.5523 5 18 5H14Z"
      />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 8C13.4477 8 13 8.44771 13 9V10C13 10.5523 13.4477 11 14 11C14.5523 11 15 10.5523 15 10V9C15 8.44772 14.5523 8 14 8Z"
      />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 13C5.44772 13 5 13.4477 5 14V16C5 16.5523 5.44772 17 6 17C6.55229 17 7 16.5523 7 16V15.5C7 15.2239 7.22386 15 7.5 15H10C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13H6Z"
      />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 17C9.44771 17 9 17.4477 9 18C9 18.5523 9.44771 19 10 19C10.5523 19 11 18.5523 11 18C11 17.4477 10.5523 17 10 17Z"
      />
    </>,
    <>
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.6807 14.5869C19.1708 14.5869 22 11.7692 22 8.29344C22 4.81767 19.1708 2 15.6807 2C12.1907 2 9.3615 4.81767 9.3615 8.29344C9.3615 9.90338 10.0963 11.0743 10.0963 11.0743L2.45441 18.6849C2.1115 19.0264 1.63143 19.9143 2.45441 20.7339L3.33616 21.6121C3.67905 21.9048 4.54119 22.3146 5.2466 21.6121L6.27531 20.5876C7.30403 21.6121 8.4797 21.0267 8.92058 20.4412C9.65538 19.4167 8.77362 18.3922 8.77362 18.3922L9.06754 18.0995C10.4783 19.5045 11.7128 18.6849 12.1537 18.0995C12.8885 17.075 12.1537 16.0505 12.1537 16.0505C11.8598 15.465 11.272 15.465 12.0067 14.7333L12.8885 13.8551C13.5939 14.4405 15.0439 14.5869 15.6807 14.5869Z"
      />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.8851 8.29353C17.8851 9.50601 16.8982 10.4889 15.6807 10.4889C14.4633 10.4889 13.4763 9.50601 13.4763 8.29353C13.4763 7.08105 14.4633 6.09814 15.6807 6.09814C16.8982 6.09814 17.8851 7.08105 17.8851 8.29353Z"
      />
    </>,
    <>
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 21H9C6.17157 21 4.75736 21 3.87868 20.1213C3 19.2426 3 17.8284 3 15M21 15C21 17.8284 21 19.2426 20.1213 20.1213C19.8215 20.4211 19.4594 20.6186 19 20.7487"
      />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16V3M12 3L16 7.375M12 3L8 7.375"
      />
    </>,
    <>
      <Circle cx="12" cy="12" r="3" />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 13.3636C2 10.2994 2 8.76721 2.74902 7.6666C3.07328 7.19014 3.48995 6.78104 3.97524 6.46268C4.69555 5.99013 5.59733 5.82123 6.978 5.76086C7.63685 5.76086 8.20412 5.27068 8.33333 4.63636C8.52715 3.68489 9.37805 3 10.3663 3H13.6337C14.6219 3 15.4728 3.68489 15.6667 4.63636C15.7959 5.27068 16.3631 5.76086 17.022 5.76086C18.4027 5.82123 19.3044 5.99013 20.0248 6.46268C20.51 6.78104 20.9267 7.19014 21.251 7.6666C22 8.76721 22 10.2994 22 13.3636C22 16.4279 22 17.9601 21.251 19.0607C20.9267 19.5371 20.51 19.9462 20.0248 20.2646C18.9038 21 17.3433 21 14.2222 21H9.77778C6.65675 21 5.09624 21 3.97524 20.2646C3.48995 19.9462 3.07328 19.5371 2.74902 19.0607C2.53746 18.7498 2.38566 18.4045 2.27673 18"
      />
      <Path strokeLinecap="round" strokeLinejoin="round" d="M19 10H18" />
    </>,
  ]);
  const [connected, setConnected] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState(0); // 0 = none, 1 = Connect via localhost, 2 = Connect via QR code, 3 = Direct input of token and address

  const [token, setToken] = React.useState("");
  const [ip, setIp] = React.useState("");
  const [port, setPort] = React.useState("");

  React.useEffect((data) => {
    Emitter.subscribe("OPR:Online", (data) => {
      setConnected(data);
    });
  }, []);

  const depreciated_methods = () => {
    /**
     * @deprecated
     */
    function readQRCode(base64) {
      console.log(base64);
    }

    /**
     * @deprecated
     */
    async function toBase64(uri) {
      function fileToBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]); // strip data URI
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      const response = await fetch(uri);
      const blob = await response.blob();

      const file = new File([blob], "qr.png", { type: blob.type });
      const base64 = await fileToBase64(file);
      return base64;
    }

    /**
     * @deprecated
     */
    async function connectViaQRUpload() {
      const result = await launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) return;

      const uri = result.assets[0].uri;
      console.log(uri);

      const base64 = await toBase64(uri);

      const final = readQRCode(base64);
    }

    /**
     * @deprecated
     */
    async function connectViaQRCapture() {
      await requestCameraPermissionsAsync();

      const result = await launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) return;

      console.log("Captured image");

      const uri = result.assets[0].uri;
      console.log(uri);

      const base64 = await toBase64(uri);

      const final = readQRCode(base64);
    }
  };

  function connectViaToken() {
    if (!token || !ip || !port) return alert("Please fill out all fields");

    Emitter.setState("OPR:DirectlyInputtedInterface", [
      {
        ip: ip,
        port: port,
        token: token,
      },
    ]);
  }

  function renderSubMenu() {
    let instruction = "";
    let content = <></>;
    switch (selectedMenu) {
      case 0:
        return null;
      case 1:
        instruction =
          "Automatically attempt to locate and connect with a locally running instance of Ophelia present on this machine";
        content = (
          <>
            <View>
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  width: "80%",
                  textAlign: "center",
                  alignSelf: "center",
                  margin: 20,
                }}
              >
                {connected
                  ? "Currently connected to Ophelia. You may now close this window."
                  : "Not currently connected. Please use the other options to connect or make sure Ophelia is running properly on this machine."}
              </Text>
            </View>
          </>
        );
        break;
      case 2:
        instruction =
          "Connects to Ophelia using the QR code provided by Ophelia";
        content = (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {/* <BigButtonWithIconComponent
                text="Upload QR Code"
                onPress={async () => {
                  await connectViaQRUpload();
                }}
                icon={icons[3]}
                index={99}
              /> */}
              <BigButtonWithIconComponent
                text="Use Camera"
                onPress={() => {
                  Emitter.publish("OPR:ScanQRCode");
                }}
                icon={icons[4]}
                index={99}
              />
            </View>
          </>
        );
        break;
      case 3:
        instruction =
          "Connect to Ophelia by directly inputting the token and address provided by Ophelia";
        content = (
          <>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: 12,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 15, marginBottom: 10 }}
                >
                  Token:
                </Text>
                <Text
                  style={{ color: "white", fontSize: 15, marginBottom: 10 }}
                >
                  IP Address:
                </Text>
                <Text style={{ color: "white", fontSize: 15 }}>Port:</Text>
              </View>

              <View style={{ flex: 1, justifyContent: "space-between" }}>
                <LinearGradient
                  colors={["#161515", "#0f0f0f"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={{
                    borderRadius: 5,
                    borderWidth: 2,
                    borderColor: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 10,
                  }}
                >
                  <TextInput
                    placeholder="Enter token"
                    placeholderTextColor={"rgba(104, 104, 104, 0.7)"}
                    value={token}
                    onChangeText={setToken}
                    style={{
                      color: "white",
                      padding: 5,
                      borderRadius: 5,
                    }}
                    onSubmitEditing={connectViaToken}
                  />
                </LinearGradient>
                <LinearGradient
                  colors={["#161515", "#0f0f0f"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={{
                    borderRadius: 5,
                    borderWidth: 2,
                    borderColor: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 10,
                  }}
                >
                  <TextInput
                    placeholder="Enter IP address"
                    placeholderTextColor={"rgba(104, 104, 104, 0.7)"}
                    value={ip}
                    onChangeText={setIp}
                    style={{
                      color: "white",
                      padding: 5,
                      borderRadius: 5,
                    }}
                    onSubmitEditing={connectViaToken}
                  />
                </LinearGradient>
                <LinearGradient
                  colors={["#161515", "#0f0f0f"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={{
                    borderRadius: 5,
                    borderWidth: 2,
                    borderColor: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  <TextInput
                    placeholder="Enter port"
                    placeholderTextColor={"rgba(104, 104, 104, 0.7)"}
                    value={port}
                    onChangeText={setPort}
                    style={{
                      color: "white",
                      padding: 5,
                      borderRadius: 5,
                    }}
                    onSubmitEditing={connectViaToken}
                  />
                </LinearGradient>
              </View>
            </View>
            <View
              style={{
                alignItems: "flex-end",
                marginTop: 10,
                flexDirection: "row-reverse",
                gap: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 5,
                  padding: 1,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "black",
                    padding: 10,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    setToken("");
                    setIp("");
                  }}
                >
                  <Text style={{ color: "white" }}>Clear</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 5,
                  padding: 1,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "black",
                    padding: 10,
                    borderRadius: 5,
                  }}
                  onPress={connectViaToken}
                >
                  <Text style={{ color: "white" }}>Connect</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        );
        break;
    }
    return (
      <InterfaceDiscoverySubComponent
        instruction={instruction}
        content={content}
      />
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: selectedMenu === 0 ? 1 : 0,
        paddingTop: 60,
        paddingBottom: 20,
        gap: 10,
      }}
    >
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "rgba(255,255,255,0.1)",
          padding: 10,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: "rgba(255,255,255,0.7)",
        }}
        onPress={() => {
          Emitter.publish("OPR:CloseForm");
        }}
      >
        <Text style={{ color: "white" }}>Close</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          backgroundColor: "rgba(255,255,255,0.1)",
          padding: 10,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: "rgba(255,255,255,0.7)",
        }}
        onPress={() => {
          setConnected(!connected);
        }}
      >
        <Text style={{ color: "white" }}>DEBUG: Fake Connection</Text>
      </TouchableOpacity> */}
      <Text
        style={{
          position: "absolute",
          top: 20,
          alignSelf: "center",
          fontSize: 20,
          fontWeight: "bold",
          color: "rgba(255,255,255,0.8)",
        }}
      >
        Interface Discovery
      </Text>
      <View
        style={{
          justifyContent: selectedMenu === 0 ? "center" : "flex-start",
          alignItems: "center",
          minHeight: selectedMenu === 0 ? "100%" : undefined,
          marginTop: selectedMenu === 0 ? 0 : 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <BigButtonWithIconComponent
            icon={icons[0]}
            text={"I am the host machine"}
            onPress={() => {
              if (selectedMenu === 1) setSelectedMenu(0);
              else setSelectedMenu(1);
            }}
            index={1}
            selectedMenu={selectedMenu}
          />
          <BigButtonWithIconComponent
            icon={icons[1]}
            text={"Scan QR Code"}
            onPress={() => {
              if (selectedMenu === 2) setSelectedMenu(0);
              else setSelectedMenu(2);
            }}
            index={2}
            selectedMenu={selectedMenu}
          />
          <BigButtonWithIconComponent
            icon={icons[2]}
            text={"Input token and address"}
            onPress={() => {
              if (selectedMenu === 3) setSelectedMenu(0);
              else setSelectedMenu(3);
              setToken("");
              setIp("");
            }}
            index={3}
            selectedMenu={selectedMenu}
          />
        </View>
        <LinearGradient
          colors={
            connected
              ? ["rgba(45, 238, 190, 0.7)", "rgba(104, 221, 8, 0.7)"]
              : ["rgba(199, 136, 20, 0.7)", "rgba(230, 31, 31, 0.7)"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            flexDirection: "row",
            // justifyContent: "space-between",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            // borderWidth: 0.05,
            borderColor: "white",
            marginTop: 30,
            marginHorizontal: 40,
            padding: 10,
            width: "90%",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            {connected ? "Connected" : "Disconnected"}
          </Text>
        </LinearGradient>
      </View>
      <View
        style={{
          display: selectedMenu !== 0 ? "flex" : "none",
          padding: 10,
        }}
      >
        {renderSubMenu()}
      </View>
    </ScrollView>
  );
};

export default InterfaceDiscoveryComponent;
