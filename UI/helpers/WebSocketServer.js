import Emitter from "./Emitter";

const defaultHost = "ws://127.0.0.1:6990";

let host = defaultHost; // TODO: Change default host later

let ws = null;
let reconnectTimer = null;
let reconnectDelay = 1000;
const MAX_DELAY = 30000;

function connect() {
  if (ws && ws.readyState === WebSocket.OPEN) return;

  console.log(`Connecting to ${host}...`);
  ws = new WebSocket(host);

  ws.onopen = () => {
    console.log("Connection opened");
    reconnectDelay = 1000;
    send(requestPlugins());
    Emitter.setState("OPR:Online", [true]);
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(`Received message: ${JSON.stringify(data)}`);

    if (data.type !== "REQUEST") return;

    switch (data.action) {
      case "REQUEST_PLUGINS":
        Emitter.setStateList("OPR:UpdatePlugins", data.payload.data);
        break;

      case "REQUEST_INPUT_SCHEME":
        Emitter.setStateList("OPR:NewPopup", data.payload.data);
        break;

      case "REQUEST_RESPONSE":
        Emitter.setStateList("OPR:NewPopup", data.payload.data);
        break;
    }
  };

  ws.onclose = () => {
    console.log("Disconnected from backend");
    Emitter.publish("OPR:Online", [false]);
    scheduleReconnect();
  };

  ws.onerror = (e) => {
    console.log("WebSocket error:", e.message || e);
    Emitter.publish("OPR:Online", [false]);
    ws?.close();
  };
}

async function discoverWS(interfaces, port, token) {
  const promises = interfaces.map(async (iface) => {
    const url = `ws://${iface.ip}:${port}/discover`;
    console.log("Discovering Ophelia on", url);

    return new Promise((resolve) => {
      let resolved = false;

      try {
        const discoverySocket = new WebSocket(url);

        discoverySocket.onopen = () => {
          discoverySocket.send(JSON.stringify({ token }));
        };

        discoverySocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.success) {
              console.log("Discovered Ophelia on", url);
              resolved = true;
              discoverySocket.close();
              resolve(iface.ip);
            } else {
              discoverySocket.close();
              resolve(null);
            }
          } catch {
            discoverySocket.close();
            resolve(null);
          }
        };

        discoverySocket.onerror = (err) => {
          console.log(
            `Failed to discover Ophelia on ${url}: ${err.message || err}`,
          );
          if (!resolved) resolve(null);
        };

        discoverySocket.onclose = () => {
          if (!resolved) resolve(null);
        };
      } catch (err) {
        console.log(`Exception connecting to ${url}: ${err.message}`);
        resolve(null);
      }
    });
  });

  const results = await Promise.all(promises);
  return results.filter(Boolean);
}

function scheduleReconnect() {
  if (reconnectTimer) return;

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    reconnectDelay = Math.min(reconnectDelay * 2, MAX_DELAY);
    connect();
  }, reconnectDelay);
}

function send(message) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.warn("Socket not open, reconnecting...");
    connect();
    return;
  }
  ws.send(message);
}

function generateRequestId() {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Checks if the given interface IP is usable for Ophelia.
 * The following interfaces are considered unusable and will return false:
 * - 127.* (localhost)
 * - ::1 (localhost in IPv6)
 * - localhost
 * - 0.0.0.0 (unassigned IP address)
 * - 169.254.* (link-local addresses)
 * @param {string} interfaceIP - The IP address of the interface to check.
 * @returns {boolean} true if the interface is usable, false otherwise.
 */
function filterUseableInterface(interfaceIP) {
  if (
    interfaceIP.startsWith("127.") ||
    interfaceIP === "::1" ||
    interfaceIP === "localhost" ||
    interfaceIP === "0.0.0.0" ||
    interfaceIP === "169.254."
  ) {
    return false;
  }
  return true;
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
    {},
  );
}

function requestInputScheme(plugin) {
  return messageScheme(
    1,
    "REQUEST",
    "REQUEST_INPUT_SCHEME",
    generateRequestId(),
    { plugin },
  );
}

function requestResponse(plugin, data) {
  return messageScheme(1, "REQUEST", "REQUEST_RESPONSE", generateRequestId(), {
    plugin,
    data,
  });
}

Emitter.subscribe("OPR:RequestPlugins", () => send(requestPlugins()));
Emitter.subscribe("OPR:RequestInputScheme", (plugin) =>
  send(requestInputScheme(plugin)),
);
Emitter.subscribe("OPR:RequestResponse", (plugin, data) =>
  send(requestResponse(plugin, data)),
);
Emitter.subscribe("OPR:Refresh", () => connect());
Emitter.subscribe("OPR:QRCodeScanned", (data) => {
  console.log("Processing scanned QR code data:", data);
  const interfaces = data.interfaces;
  console.log("Interfaces:", interfaces);

  const candidates = interfaces.filter((i) => filterUseableInterface(i.ip));

  console.log("Filtered interfaces:", candidates);

  discover(candidates, data.port, data.token).then((ip) => {
    if (ip) {
      host = `ws://${ip}:${data.port}`;
      connect();
    } else {
      console.log("No usable interfaces found");
    }
  });
});

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
