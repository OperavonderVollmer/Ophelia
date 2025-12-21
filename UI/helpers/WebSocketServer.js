import parseErrorStack from "react-native/Libraries/Core/Devtools/parseErrorStack";
import Emitter from "./Emitter";

export const ws = new WebSocket("ws://127.0.0.1:6990");

ws.onopen = () => {
  console.log("Connection opened, retrieving plugins");
  ws.send(requestPlugins());
};



ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(`Received message: ${JSON.stringify(data)}`);
  switch (data.type) {
    case "EVENT":
      return;
    case "REQUEST":
      switch (data.action) {
        case "REQUEST_PLUGINS":
          console.log("Received plugins");
          Emitter.publishList("OPR:UpdatePlugins", data.payload.data);
          break;
        case "REQUEST_INPUT_SCHEME":
          console.log("Received input scheme");
          Emitter.publishList("OPR:NewPopup", data.payload.data);
          break;
        case "REQUEST_RESPONSE":
          console.log("Received response");
          Emitter.publishList("OPR:NewPopup", data.payload.data);
      }
  }
};

ws.onclose = () => {
  console.log("Disconnected from backend");
};

ws.onerror = (e) => {
  console.log("WebSocket error:", e.message || e);
};

function generateRequestId() {
  return Math.random().toString(36).substring(2, 9);
}
function messageScheme(version, type, action, requestId, payload) {
  /* To accommodate every plugin, the handler is expecting a dictionary with the following structure:
    {
        "version": 1,
        "type": "REQUEST" or "EVENT",
        "action": "GET_PLUGINS",
        "requestId": "1234",
        "payload": {}
    }
  */
  const message = JSON.stringify({
    version: version,
    type: type,
    action: action,
    requestId: requestId,
    payload: { ...payload },
  });
  console.log(`Packing message: ${message}`);
  return message;
}
function requestPlugins() {
  return messageScheme(
    1,
    "REQUEST",
    "REQUEST_PLUGINS",
    generateRequestId(),
    {}
  );
}
function requestInputScheme(plugin) {
  return messageScheme(
    1,
    "REQUEST",
    "REQUEST_INPUT_SCHEME",
    generateRequestId(),
    {
      plugin: plugin,
    }
  );
}
function requestResponse(plugin, data) {
  return messageScheme(1, "REQUEST", "REQUEST_RESPONSE", generateRequestId(), {
    plugin: plugin,
    data: data,
  });
}
Emitter.subscribe("OPR:RequestPlugins", () => ws.send(requestPlugins()));
Emitter.subscribe("OPR:RequestInputScheme", (plugin) =>
  ws.send(requestInputScheme(plugin))
);
Emitter.subscribe("OPR:RequestResponse", (plugin, data) => {
  console.log(`Plugin: ${plugin} - Data: ${JSON.stringify(data)}`);
  ws.send(requestResponse(plugin, data));
});
