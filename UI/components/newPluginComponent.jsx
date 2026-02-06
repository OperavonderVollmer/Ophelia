import React from "react";
import { View, Text } from "react-native";
import Emitter from "../helpers/Emitter";
import { styles, gradientColors } from "../app/styles";

const NewPluginComponent = () => {
  const [pluginList, setPluginList] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = Emitter.subscribe("OPR:UpdateRepo", (payload) => {
      const p = payload.data;
      console.log(`Received plugins: ${JSON.stringify(p)}`);
      setPluginList(p);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    Emitter.publish("OPR:RequestRepo");
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Plugin Component</Text>
      {pluginList ?? (
        <View>
          {pluginList.map((plugin) => {
            return (
              <View key={plugin}>
                <Text>{plugin}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default NewPluginComponent;
