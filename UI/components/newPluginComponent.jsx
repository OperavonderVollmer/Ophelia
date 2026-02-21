import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Emitter from "../helpers/Emitter";
import { styles } from "../app/styles";
import NewPluginSubComponent from "./sub-components/newPluginSubComponent";

const NewPluginComponent = () => {
  const [pluginList, setPluginList] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = Emitter.subscribe("OPR:UpdateRepo", (payload) => {
      const p = payload.data;
      console.log(`Received plugins: ${JSON.stringify(p)}`);
      p.forEach((plugin) => console.log(`Plugin name: ${plugin.name}`));
      setPluginList(p);
    });
    return () => {
      try {
        unsubscribe();
      } catch {}
    };
  }, []);

  React.useEffect(() => {
    Emitter.publish("OPR:RequestRepo");
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
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
          zIndex: 10,
        }}
        onPress={() => {
          Emitter.publish("OPR:CloseForm");
        }}
      >
        <Text style={{ color: "white" }}>Close</Text>
      </TouchableOpacity>
      <Text
        style={[
          styles.title,
          {
            color: "white",
            marginBottom: 20,
            fontSize: 20,
            fontWeight: "bold",
          },
        ]}
      >
        Plugin Repository
      </Text>
      {pluginList.length ? (
        <View>
          {pluginList.map((plugin) => {
            return <NewPluginSubComponent plugin={plugin} key={plugin.name} />;
          })}
        </View>
      ) : (
        <View
          style={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 16,
              paddingBottom: 200,
            }}
          >
            Couldn't load plugins from the repository. Check your internet
            connection or Ophelia server
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default NewPluginComponent;
