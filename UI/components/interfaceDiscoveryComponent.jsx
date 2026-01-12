import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import InputComponent from "./inputComponent";
import { styles } from "../app/styles";
import { StyleSheet } from "react-native";
import BigButtonWithIconComponent from "./sub-components/bigButtonWithIconComponent";

const InterfaceDiscoveryComponent = () => {
  const [selectedMenu, setSelectedMenu] = React.useState(0); // 0 = none, 1 = first, 2 = second, 3 = third
  const subMenuContent = React.useMemo(() => {
    switch (selectedMenu) {
      case 0:
        return null;
      case 1:
        return <Text style={{ color: "white" }}>First</Text>;
      case 2:
        return <Text style={{ color: "white" }}>Second</Text>;
      case 3:
        return <Text style={{ color: "white" }}>Third</Text>;
      default:
        return null;
    }
  });
  return (
    <View style={{ flex: 1 }}>
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
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
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
            icon={
              <Svg
                width={80}
                height={80}
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth={1.5}
              >
                <Path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 21H17M9 17V21M15 17V21M6.2 17H17.8C18.9201 17 19.4802 17 19.908 16.782C20.2843 16.5903 20.5903 16.2843 20.782 15.908C21 15.4802 21 14.9201 21 13.8V6.2C21 5.0799 21 4.51984 20.782 4.09202C20.5903 3.71569 20.2843 3.40973 19.908 3.21799C19.4802 3 18.9201 3 17.8 3H6.2C5.0799 3 4.51984 3 4.09202 3.21799C3.71569 3.40973 3.40973 3.71569 3.21799 4.09202C3 4.51984 3 5.07989 3 6.2V13.8C3 14.9201 3 15.4802 3.21799 15.908C3.40973 16.2843 3.71569 16.5903 4.09202 16.782C4.51984 17 5.07989 17 6.2 17Z"
                />
              </Svg>
            }
            text={"I am the host machine"}
            onPress={() => {
              if (selectedMenu === 1) setSelectedMenu(0);
              else setSelectedMenu(1);
            }}
          />
          <BigButtonWithIconComponent
            icon={
              <Svg
                width={80}
                height={80}
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth={0.8}
              >
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
              </Svg>
            }
            text={"Scan QR Code"}
            onPress={() => {
              if (selectedMenu === 2) setSelectedMenu(0);
              else setSelectedMenu(2);
            }}
          />
          <BigButtonWithIconComponent
            icon={
              <Svg
                width={80}
                height={80}
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth={0.9}
              >
                <Path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.5 9.00001V15H8.5M8.5 15L9.5 14M8.5 15L9.5 16M13 5H17.5C18.0523 5 18.5 5.44772 18.5 6V18C18.5 18.5523 18.0523 19 17.5 19H6.5C5.94772 19 5.5 18.5523 5.5 18V12C5.5 11.4477 5.94772 11 6.5 11H12V6C12 5.44771 12.4477 5 13 5Z"
                />
              </Svg>
            }
            text={"Input token and address"}
            onPress={() => {
              if (selectedMenu === 3) setSelectedMenu(0);
              else setSelectedMenu(3);
            }}
          />
        </View>
      </View>
      <View
        style={{
          display: selectedMenu !== 0 ? "flex" : "none",
          flex: 1,
          margin: 10,
          padding: 10,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: "white",
        }}
      >
        {subMenuContent}
      </View>
    </View>
  );
};

export default InterfaceDiscoveryComponent;
