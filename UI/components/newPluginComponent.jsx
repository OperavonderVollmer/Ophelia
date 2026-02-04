import React from "react";
import { View } from "react-native";
import Emitter from "../helpers/Emitter";

const NewPluginComponent = () => {
    const [pluginList, setPluginList] = React.useState([]);

    React.useEffect(() => {
        const unsubscribe = Emitter.subscribe("OPR:UpdatePlugins", (payload) => {
            setPluginList(payload);
        });
        return () => unsubscribe();
    }, []);

    


    return <View></View>
};

export default NewPluginComponent;