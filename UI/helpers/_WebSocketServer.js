// websocketServer.js
const WebSocket = require("ws");
const wss = new WebSocket.Server({ host: "127.0.0.1", port: 6990 });

console.log("WebSocket server started on port 6990");
