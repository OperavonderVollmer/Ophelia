import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Dimensions } from "react-native";
import Emitter from "../helpers/Emitter";
import ButtonWithIconComponent from "./sub-components/buttonWithIconComponent";

const TopBarComponent = ({ styles }) => {
  const [isPhone, setIsPhone] = React.useState(
    Dimensions.get("window").width < 600
  );

  const [serverStatus, setServerStatus] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = Emitter.subscribe("OPR:Online", (status) => {
      console.log("Status: ", status);
      setServerStatus(status);
    });
    return () => unsubscribe();
  }, []);

  const serverStatusText = React.useMemo(() => {
    if (serverStatus) {
      return "Online";
    } else {
      return "Offline, please configure";
    }
  }, [serverStatus]);

  const serverStatusSVG = React.useMemo(() => {
    if (serverStatus) {
      return (
        <Svg width={20} height={20} viewBox="0 0 16 16" fill="none">
          <Path
            d="M0 7L1.17157 5.82843C2.98259 4.01741 5.43884 3 8 3C10.5612 3 13.0174 4.01742 14.8284 5.82843L16 7L14.5858 8.41421L13.4142 7.24264C11.9783 5.8067 10.0307 5 8 5C5.96928 5 4.02173 5.8067 2.58579 7.24264L1.41421 8.41421L0 7Z"
            fill="rgba(255, 255, 255, 0.8)"
          />
          <Path
            d="M4.24264 11.2426L2.82843 9.82843L4 8.65685C5.06086 7.59599 6.49971 7 8 7C9.50029 7 10.9391 7.59599 12 8.65686L13.1716 9.82843L11.7574 11.2426L10.5858 10.0711C9.89999 9.38527 8.96986 9 8 9C7.03014 9 6.1 9.38527 5.41421 10.0711L4.24264 11.2426Z"
            fill="rgba(255, 255, 255, 0.8)"
          />
          <Path
            d="M8 15L5.65685 12.6569L6.82842 11.4853C7.13914 11.1746 7.56057 11 8 11C8.43942 11 8.86085 11.1746 9.17157 11.4853L10.3431 12.6569L8 15Z"
            fill="rgba(255, 255, 255, 0.8)"
          />
        </Svg>
      );
    } else {
      return (
        <Svg width={20} height={20} viewBox="0 0 16 16" fill="none">
          <Path
            d="M13 16H16L3 0H0L3.38948 4.17167C2.58157 4.61063 1.83348 5.16652 1.17157 5.82842L0 7L1.41421 8.41421L2.58579 7.24264C3.20071 6.62772 3.90945 6.12819 4.67837 5.75799L5.98803 7.36989C5.24898 7.65114 4.56994 8.08691 4 8.65685L2.82843 9.82842L4.24264 11.2426L5.41421 10.0711C5.94688 9.5384 6.62695 9.18703 7.35855 9.05668L8.9375 11H8.00355C7.56057 11 7.13914 11.1746 6.82842 11.4853L5.65685 12.6568L8 15L10.3103 12.6897L13 16Z"
            fill="rgba(255, 255, 255, 0.8)"
          />
          <Path
            d="M10.3673 5.37513C11.5055 5.74521 12.5521 6.38051 13.4142 7.24264L14.5858 8.41421L16 7L14.8284 5.82842C13.1228 4.12278 10.8448 3.12107 8.44586 3.01028L10.3673 5.37513Z"
            fill="rgba(255, 255, 255, 0.8)"
          />
        </Svg>
      );
    }
  }, [serverStatus]);

  React.useEffect(() => {
    const onChange = ({ window }) => setIsPhone(window.width < 600);

    const subscription = Dimensions.addEventListener("change", onChange);

    return () => subscription?.remove();
  }, []);

  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        marginTop: isPhone ? 30 : 0,
      }}
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
      <ButtonWithIconComponent
        styles={styles}
        icon={
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
        }
        text="Refresh"
        onPress={() => {
          Emitter.publish("OPR:RequestPlugins");
        }}
      />
      <ButtonWithIconComponent
        styles={styles}
        icon={
          <Svg width={20} height={20} viewBox="0 0 16 16" fill="none">
            <Path
              d="M10 3.5L13.0581 0.441881C12.4304 0.15802 11.7337 0 11 0C8.23858 0 6 2.23858 6 5C6 5.45802 6.06158 5.90165 6.17692 6.32308L0 12.5L3.5 16L9.67692 9.82308C10.0983 9.93842 10.542 10 11 10C13.7614 10 16 7.76142 16 5C16 4.26633 15.842 3.56956 15.5581 2.94188L12.5 6H10V3.5Z"
              fill="rgba(255, 255, 255, 0.8)"
            />
          </Svg>
        }
        text="Plugins"
        onPress={() => {
          Emitter.publish("OPR:Refresh");
        }}
      />
      <ButtonWithIconComponent
        styles={styles}
        icon={
          <Svg width={20} height={20} viewBox="0 0 16 16" fill="none">
            <Path
              d="M5.5 5.5C5.5 4.11929 6.61929 3 8 3C9.38071 3 10.5 4.11929 10.5 5.5C10.5 6.88071 9.38071 8 8 8H7V11H8C11.0376 11 13.5 8.53757 13.5 5.5C13.5 2.46243 11.0376 0 8 0C4.96243 0 2.5 2.46243 2.5 5.5H5.5Z"
              fill="rgba(255, 255, 255, 0.8)"
            />
            <Path d="M10 13H7V16H10V13Z" fill="rgba(255, 255, 255, 0.8)" />
          </Svg>
        }
        text="Help"
        onPress={() => {
          Emitter.publish("OPR:OpenHelp");
        }}
      />
      <ButtonWithIconComponent
        styles={styles}
        icon={serverStatusSVG}
        text={serverStatusText}
        onPress={() => {}}
      />
    </View>
  );
};

export default TopBarComponent;

{
  /* <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g
    id="SVGRepo_tracerCarrier"
    stroke-linecap="round"
    stroke-linejoin="round"
  ></g>
  <g id="SVGRepo_iconCarrier">
    {" "}
    <path
      d="M13 16H16L3 0H0L3.38948 4.17167C2.58157 4.61063 1.83348 5.16652 1.17157 5.82842L0 7L1.41421 8.41421L2.58579 7.24264C3.20071 6.62772 3.90945 6.12819 4.67837 5.75799L5.98803 7.36989C5.24898 7.65114 4.56994 8.08691 4 8.65685L2.82843 9.82842L4.24264 11.2426L5.41421 10.0711C5.94688 9.5384 6.62695 9.18703 7.35855 9.05668L8.9375 11H8.00355L8 11C7.56057 11 7.13914 11.1746 6.82842 11.4853L5.65685 12.6568L8 15L10.3103 12.6897L13 16Z"
      fill="#000000"
      style="--darkreader-inline-fill: var(--darkreader-background-000000, #000000);"
      data-darkreader-inline-fill=""
    ></path>{" "}
    <path
      d="M10.3673 5.37513C11.5055 5.74521 12.5521 6.38051 13.4142 7.24264L14.5858 8.41421L16 7L14.8284 5.82842C13.1228 4.12278 10.8448 3.12107 8.44586 3.01028L10.3673 5.37513Z"
      fill="#000000"
      style="--darkreader-inline-fill: var(--darkreader-background-000000, #000000);"
      data-darkreader-inline-fill=""
    ></path>{" "}
  </g>
</svg>; */
}
