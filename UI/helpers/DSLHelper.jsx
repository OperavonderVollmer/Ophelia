import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Picker,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Emitter from "../helpers/Emitter";

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "column" },
  content: {
    flexDirection: "column",
    padding: 10,
    fontFamily: "Poppins_600",
  },
  section: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  buttonGradient: { padding: 3, borderRadius: 8 },
  buttonInner: {
    backgroundColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: "white",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: "white",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "200",
    letterSpacing: 0.5,
    textShadowColor: "rgba(61, 61, 61, 0.25)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 1,
    paddingBottom: 9,
  },
  italic: { fontStyle: "italic" },
  inputFieldDefaults: { paddingLeft: 20 },
  inputDefault: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    borderRadius: 5,
    color: "white",
  },
  placeholderColor: { color: "rgba(255, 255, 255, 0.5)" },
  noInputFieldDefaults: { paddingLeft: 0 },
  divDefault: {
    gap: 10,
    marginVertical: 10,
  },
  divHorizontal: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  divVertical: {
    display: "flex",
    flexDirection: "column",
  },
  divRaised: {
    padding: 20,
    borderStyle: "inset",
    borderWidth: 5,
    borderColor: "rgba(100, 100, 100, 0.5)",
    alignItems: "center",
  },
  divCentered: {
    alignItems: "center",
    justifyContent: "center",
  },
  poppinsSmall: { fontFamily: "Poppins_400" },
  poppinsMedium: { fontFamily: "Poppins_500" },
  poppinsLarge: { fontFamily: "Poppins_600" },
  compensateMarginRight: {
    marginRight: 25,
  },
  selectDefault: {},
  labelDefault: {},
  headerDivDefault: {},
  // headerDefault: { fontWeight: "700" },
  italic: { fontStyle: "italic" },
  bold: { fontWeight: "500" },
  whiteText: { color: "white" },
  bolder: { fontWeight: "700" },
  h1Default: { fontSize: 32 },
  h2Default: { fontSize: 28 },
  h3Default: { fontSize: 24 },
  h4Default: { fontSize: 20 },
  h5Default: { fontSize: 18 },
  h6Default: { fontSize: 16 },
});

export function DSLHelper({ payload }) {
  const [values, setValues] = React.useState({});
  const effects = payload.data[0].effects ?? [];
  const presets = payload.data[0].presets ?? {};

  function setValueForId(id, value) {
    setValues((prev) => ({ ...prev, [id]: value }));
  }


  const presetTriggerId = React.useMemo(() => {
    if (!effects) return null;
    for (const k in effects) {
      if (effects[k] === "applyPreset") return k;
    }
    return null;
  }, [effects]);

  React.useEffect(() => {
    if (!presetTriggerId) return;

    const selectedPresetLabel = values[presetTriggerId];
    if (!selectedPresetLabel) return;

    const preset = presets?.[selectedPresetLabel];
    if (!preset) return;

    // Apply the whole preset in ONE update
    setValues((prev) => ({ ...prev, ...preset }));
  }, [presetTriggerId, values[presetTriggerId]]);

  function exportValues() {
    //{"version":1,"type":"REQUEST","action":"REQUEST_INPUT_SCHEME","requestId":"ygpc0y7","payload":{"plugin":"ScreenMonitor"}}
    Emitter.publish("OPR:RequestResponse", [payload.data[0].title, values]);
    return { ...values };
  }

  function renderNode(node) {
    if (!node || !node.type) return null;
    // console.log(`Divining node: ${JSON.stringify(node)}`);

    const classStyle = node.classes
      ? node.classes
          .split(/\s+/)
          .map((c) => styles[c])
          .filter(Boolean)
      : null;

    switch (node.type) {
      case "div":
        return divHelper(node, classStyle, renderNode);
      case "input":
        return textBoxHelper(node, classStyle, values, setValueForId);
      case "select":
        return selectHelper(node, classStyle, values, setValueForId);
      case "label":
        return labelHelper(node, classStyle);
      case "h1":
        return h1Helper(node, classStyle);
      case "h2":
        return h2Helper(node, classStyle);
      case "h3":
        return h3Helper(node, classStyle);
      case "h4":
        return h4Helper(node, classStyle);
      case "h5":
        return h5Helper(node, classStyle);
      case "h6":
        return h6Helper(node, classStyle);
      default:
        return null;
    }
  }

  const content = renderNode(payload.data[0].root);

  return (
    /// render stuff
    <React.Fragment>
      {payload.data[0].title && (
        <Text style={styles.formTitle}>{payload.data[0].title}</Text>
      )}{" "}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {payload.data[0].description &&
          renderSection("Description", payload.data[0].description)}
        {payload.data[0].prompt &&
          renderSection("Prompt", payload.data[0].prompt)}

        {content}
      </ScrollView>
      {payload.data[0].form ? (
        <View style={styles.buttons}>
          <LinearGradient
            colors={["rgba(51, 51, 51, 1)", "rgba(77, 77, 77, 1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.buttonGradient, { width: "19%" }]}
          >
            <TouchableOpacity
              style={styles.buttonInner}
              onPress={() => {
                Emitter.publish("OPR:CloseForm");
              }}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            colors={["rgba(255, 0, 0, 1)", "rgba(0, 17, 255, 1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.buttonGradient, { width: "80%" }]}
          >
            <TouchableOpacity
              style={styles.buttonInner}
              onPress={() => {
                Emitter.publish("OPR:CloseForm");
                Emitter.publish("OPR:SubmitForm", exportValues());
              }}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      ) : (
        <View style={styles.buttons}>
          <LinearGradient
            colors={["rgba(51, 51, 51, 1)", "rgba(77, 77, 77, 1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.buttonGradient, { width: "100%" }]}
          >
            <TouchableOpacity
              style={styles.buttonInner}
              onPress={() => {
                Emitter.publish("OPR:CloseForm");
              }}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
    </React.Fragment>
  );
}

export function renderSection(header, data) {
  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionHeader,
          styles.inputLabel,
          styles.poppinsLarge,
          styles.whiteText,
        ]}
      >
        {header}
      </Text>
      <Text
        style={[
          styles.sectionText,
          styles.inputFieldDefaults,
          styles.poppinsSmall,
          { color: "rgb(235, 235, 235)" },
        ]}
      >
        {data}
      </Text>
    </View>
  );
}

export function divHelper(node, classStyle, renderNode) {
  return (
    <View
      style={[styles.divDefault, classStyle]}
      key={node.id} // stable key
    >
      {node.title ? <Text style={styles.divTitle}>{node.title}</Text> : null}

      {(node.children || []).map((child) =>
        React.cloneElement(renderNode(child), { key: child.id }),
      )}
    </View>
  );
}

export function textBoxHelper(node, classStyle, values, setValueForId) {
  const kbd = node.props?.input_type || "default";
  const isNumeric = ["number-pad", "numeric", "decimal-pad"].includes(kbd);

  React.useEffect(() => {
    if (values[node.id] == null) {
      setValueForId(node.id, "");
    }
  }, [node.id]);

  return (
    <View key={node.id} style={{}}>
      {node.props?.label ? (
        <Text style={[styles.inputLabel, styles.whiteText]}>
          {node.props?.label}
        </Text>
      ) : null}
      <View style={styles.inputFieldDefaults}>
        <TextInput
          style={[styles.inputDefault, classStyle]}
          keyboardType={node.props?.input_type || "default"}
          placeholder={node.props?.hint}
          placeholderTextColor={styles.placeholderColor.color}
          value={values[node.id] || ""}
          onChangeText={(text) => {
            let next = text;

            if (isNumeric) {
              next = next.replace(/[^0-9]/g, "");
            }

            setValueForId(node.id, next);
          }}
        />
      </View>
    </View>
  );
}

export function selectHelper(node, classStyle, values, setValueForId) {
  const options = node.props?.options || [];

  React.useEffect(() => {
    if (values[node.id] == null) {
      setValueForId(node.id, options[0]);
    }
  }, [node.id, options.join("|")]);

  return (
    <View key={node.id} style={{ marginBottom: 10 }}>
      {node.props?.label ? (
        <Text style={[styles.inputLabel, styles.whiteText]}>
          {node.props.label}
        </Text>
      ) : null}
      <View style={styles.inputFieldDefaults}>
        <Picker
          style={[styles.selectDefault, classStyle]}
          onValueChange={(value) => setValueForId(node.id, value)}
          placeholder={node.hint}
          selectedValue={values[node.id]}
        >
          {options.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

export function labelHelper(node, classStyle) {
  console.log(node);
  return (
    <View key={node.id} style={{}}>
      {node.props?.text ? (
        <Text style={[styles.labelDefault, styles.whiteText, classStyle]}>
          {node.props?.text}
        </Text>
      ) : null}
    </View>
  );
}

export function h1Helper(node, classStyle) {
  return (
    <View key={node.id} style={{}}>
      {node.props?.text ? (
        <Text
          style={[
            styles.inputLabel,
            styles.whiteText,
            styles.h1Default,
            styles.italic,
            styles.headerDefault,
            classStyle,
          ]}
        >
          {node.props?.text}
        </Text>
      ) : null}
    </View>
  );
}

export function h2Helper(node, classStyle) {
  return (
    <View key={node.id} style={{}}>
      {node.props?.text ? (
        <Text
          style={[
            styles.inputLabel,
            styles.whiteText,
            styles.h2Default,
            styles.italic,
            styles.headerDefault,
            classStyle,
          ]}
        >
          {node.props?.text}
        </Text>
      ) : null}
    </View>
  );
}

export function h3Helper(node, classStyle) {
  return (
    <View key={node.id} style={{}}>
      {node.props?.text ? (
        <Text
          style={[
            styles.inputLabel,
            styles.whiteText,
            styles.h3Default,
            styles.italic,
            styles.headerDefault,
            classStyle,
          ]}
        >
          {node.props?.text}
        </Text>
      ) : null}
    </View>
  );
}

export function h4Helper(node, classStyle) {
  return (
    <View key={node.id} style={{}}>
      {node.props?.text ? (
        <Text
          style={[
            styles.inputLabel,
            styles.whiteText,
            styles.h4Default,
            styles.italic,
            styles.headerDefault,
            classStyle,
          ]}
        >
          {node.props?.text}
        </Text>
      ) : null}
    </View>
  );
}

export function h5Helper(node, classStyle) {
  return (
    <View key={node.id} style={{}}>
      {node.props?.text ? (
        <Text
          style={[
            styles.inputLabel,
            styles.whiteText,
            styles.h5Default,
            styles.italic,
            styles.headerDefault,
            classStyle,
          ]}
        >
          {node.props?.text}
        </Text>
      ) : null}
    </View>
  );
}

export function h6Helper(node, classStyle) {
  return (
    <View key={node.id} style={{}}>
      {node.props?.text ? (
        <Text
          style={[
            styles.inputLabel,
            styles.whiteText,
            styles.h6Default,
            styles.italic,
            styles.headerDefault,
            classStyle,
          ]}
        >
          {node.props?.text}
        </Text>
      ) : null}
    </View>
  );
}
