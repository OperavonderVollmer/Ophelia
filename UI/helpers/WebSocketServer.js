import Emitter from "./Emitter";

const host = "ws://127.0.0.1:6990";

let ws = null;
let reconnectTimer = null;
let reconnectDelay = 1000;
const MAX_DELAY = 30000;

/* -----------------------------
   Connection Lifecycle
----------------------------- */

function connect() {
  if (ws && ws.readyState === WebSocket.OPEN) return;

  console.log("Connecting to backend...");
  ws = new WebSocket(host);

  ws.onopen = () => {
    console.log("Connection opened");
    reconnectDelay = 1000;
    send(requestPlugins());
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(`Received message: ${JSON.stringify(data)}`);

    if (data.type !== "REQUEST") return;

    switch (data.action) {
      case "REQUEST_PLUGINS":
        Emitter.publishList("OPR:UpdatePlugins", data.payload.data);
        break;

      case "REQUEST_INPUT_SCHEME":
        Emitter.publishList("OPR:NewPopup", data.payload.data);
        break;

      case "REQUEST_RESPONSE":
        Emitter.publishList("OPR:NewPopup", data.payload.data);
        break;
    }
  };

  ws.onclose = () => {
    console.log("Disconnected from backend");
    scheduleReconnect();
  };

  ws.onerror = (e) => {
    console.log("WebSocket error:", e.message || e);
    ws?.close();
  };
}

function scheduleReconnect() {
  if (reconnectTimer) return;

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    reconnectDelay = Math.min(reconnectDelay * 2, MAX_DELAY);
    connect();
  }, reconnectDelay);
}

/* -----------------------------
   Safe Send
----------------------------- */

function send(message) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.warn("Socket not open, reconnecting...");
    connect();
    return;
  }
  ws.send(message);
}

/* -----------------------------
   Message Builders (unchanged)
----------------------------- */

function generateRequestId() {
  return Math.random().toString(36).substring(2, 9);
}

function messageScheme(version, type, action, requestId, payload) {
  return JSON.stringify({
    version,
    type,
    action,
    requestId,
    payload: { ...payload },
  });
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
    { plugin }
  );
}

function requestResponse(plugin, data) {
  return messageScheme(1, "REQUEST", "REQUEST_RESPONSE", generateRequestId(), {
    plugin,
    data,
  });
}

/* -----------------------------
   Emitter Wiring
----------------------------- */

Emitter.subscribe("OPR:RequestPlugins", () => send(requestPlugins()));
Emitter.subscribe("OPR:RequestInputScheme", (plugin) =>
  send(requestInputScheme(plugin))
);
Emitter.subscribe("OPR:RequestResponse", (plugin, data) =>
  send(requestResponse(plugin, data))
);
Emitter.subscribe("OPR:Refresh", () => connect());

/* -----------------------------
   Bootstrap
----------------------------- */

connect();

// import parseErrorStack from "react-native/Libraries/Core/Devtools/parseErrorStack";
// import Emitter from "./Emitter";

// const host = "ws://127.0.0.1:6990";
// var connection = false;
// export const ws = new WebSocket(host);

// ws.onopen = () => {
//   console.log("Connection opened, retrieving plugins");
//   ws.send(requestPlugins());
//   connection = true;
// };

// ws.onmessage = (event) => {
//   const data = JSON.parse(event.data);
//   console.log(`Received message: ${JSON.stringify(data)}`);
//   switch (data.type) {
//     case "EVENT":
//       return;
//     case "REQUEST":
//       switch (data.action) {
//         case "REQUEST_PLUGINS":
//           console.log("Received plugins");
//           Emitter.publishList("OPR:UpdatePlugins", data.payload.data);
//           break;
//         case "REQUEST_INPUT_SCHEME":
//           console.log("Received input scheme");
//           Emitter.publishList("OPR:NewPopup", data.payload.data);
//           break;
//         case "REQUEST_RESPONSE":
//           console.log("Received response");
//           Emitter.publishList("OPR:NewPopup", data.payload.data);
//       }
//   }
// };

// ws.onclose = () => {
//   console.log("Disconnected from backend");
//   connection = false;
// };

// ws.onerror = (e) => {
//   console.log("WebSocket error:", e.message || e);
// };

// function generateRequestId() {
//   return Math.random().toString(36).substring(2, 9);
// }
// function messageScheme(version, type, action, requestId, payload) {
//   /* To accommodate every plugin, the handler is expecting a dictionary with the following structure:
//     {
//         "version": 1,
//         "type": "REQUEST" or "EVENT",
//         "action": "GET_PLUGINS",
//         "requestId": "1234",
//         "payload": {}
//     }
//   */
//   const message = JSON.stringify({
//     version: version,
//     type: type,
//     action: action,
//     requestId: requestId,
//     payload: { ...payload },
//   });
//   console.log(`Packing message: ${message}`);
//   return message;
// }
// function requestPlugins() {
//   return messageScheme(
//     1,
//     "REQUEST",
//     "REQUEST_PLUGINS",
//     generateRequestId(),
//     {}
//   );
// }
// function requestInputScheme(plugin) {
//   return messageScheme(
//     1,
//     "REQUEST",
//     "REQUEST_INPUT_SCHEME",
//     generateRequestId(),
//     {
//       plugin: plugin,
//     }
//   );
// }
// function requestResponse(plugin, data) {
//   return messageScheme(1, "REQUEST", "REQUEST_RESPONSE", generateRequestId(), {
//     plugin: plugin,
//     data: data,
//   });
// }
// Emitter.subscribe("OPR:RequestPlugins", () => ws.send(requestPlugins()));
// Emitter.subscribe("OPR:RequestInputScheme", (plugin) =>
//   ws.send(requestInputScheme(plugin))
// );
// Emitter.subscribe("OPR:RequestResponse", (plugin, data) => {
//   console.log(`Plugin: ${plugin} - Data: ${JSON.stringify(data)}`);
//   ws.send(requestResponse(plugin, data));
// });
// Emitter.subscribe("OPR:Refresh", () => {
//   if (connection === false) {
//     ws = new WebSocket(host);
//   }
//   ws.send(requestPlugins());
// });
