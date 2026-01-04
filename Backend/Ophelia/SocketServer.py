import asyncio
import websockets
import json
from OperaPowerRelay import opr
import os, sys
root = os.path.dirname(os.path.abspath(__file__))
if root not in sys.path:
    sys.path.insert(0, root)
import threading
import datetime
import requests

class SocketServer:

    def __init__(self, host, port, api_url, run_local: bool = True):
        self.host = host
        self.port = port
        self.api_url = api_url
        self.server = None
        self._running = False
        self._server_thread = None
        self._server_event_loop = None
        self._stop_event = None
        self._fully_booted = False
        self.run_local = run_local
        self.logs = []

    def verify_message(self, data):
        required_keys = ["version", "type", "action", "requestId", "payload"] 
        return all(key in data for key in required_keys)
    
    def message_scheme(self, version, type, action, requestId, payload):
        return {
            "version": version,
            "type": type,
            "action": action,
            "requestId": requestId,
            "payload": payload
        }

    def contact_api(self, **kwargs):
        try:
            request = kwargs.get("type", "REQUEST")
            action = kwargs.get("action", "REQUEST_PLUGINS")
            payload = kwargs.get("payload", {})
            plugin_name = kwargs.get("plugin") or payload.get("plugin")
            to_ship = {
                "requestId": kwargs.get("requestId"),
                "plugin": plugin_name,
                "payload": payload
            }
            if request == "EVENT":
                opr.write_log(isFrom="Ophelia - SocketServer", message=f"EVENT: {action} - {payload}", level="INFO", filename="OpheliaServer.log")
                opr.send_toast_notification(app_id="Ophelia Socket Server", title="Event", msg=f"Event: {action}", icon_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "Ophelia_Logo.png"))
                return
            else:
                print(f"Contacting API for {action} with {to_ship}")
                response = requests.post(f"{self.api_url}/{action}", json=to_ship)
                return response.json()
        except requests.exceptions.RequestException as e:
            opr.error_pretty(exc=e, name="Ophelia - SocketServer", message="Failed to contact API.")

    async def sending(self, websocket, message):
        opr.write_log(isFrom="Ophelia - SocketServer", message=f"Sending: {message}", level="INFO", filename="OpheliaServer.log", verbose=True)
        await websocket.send(message)

    async def handler(self, websocket, path=None):
        opr.write_log(isFrom="Ophelia - SocketServer", message=f"New connection from {websocket.remote_address[0] or 'Unknown IP'}:{websocket.remote_address[1] or 'Unknown Port'}", level="INFO", filename="OpheliaServer.log")
    
        opr.send_toast_notification(app_id="Ophelia Socket Server", title="New Connection", msg=f"Connection from {websocket.remote_address[0] or 'Unknown IP'}", icon_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "Ophelia_Logo.png"))

        try:
            async for message in websocket:
                data = json.loads(message)

                self.logs.append({
                    "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "client": f"{websocket.remote_address[0] or 'Unknown IP'}:{websocket.remote_address[1] or 'Unknown Port'}",
                    "data": data
                })
                if not self.verify_message(data):
                    response = {"status": "error", "message": "Invalid message."}
                    await websocket.send(json.dumps(self.message_scheme(1, "EVENT", "ERROR", data.get("requestId"), response)))
                    continue
                    
                match data["action"]:
                    case "REQUEST_PLUGINS":
                        plugin_list = await asyncio.to_thread(self.contact_api, type="REQUEST", action="REQUEST_PLUGINS", requestId=data.get("requestId"))
                        response = {"status": "success", "message": "Plugins retrieved successfully.", "data": plugin_list}
                        await self.sending(websocket=websocket, message=json.dumps(self.message_scheme(1, "REQUEST", "REQUEST_PLUGINS", data.get("requestId"), response)))
                    case "REQUEST_INPUT_SCHEME":                        
                        input_scheme = await asyncio.to_thread(self.contact_api, type="REQUEST", action="REQUEST_INPUT_SCHEME", requestId=data.get("requestId"), plugin=data.get("payload").get("plugin"))
                        response = {"status": "success", "message": "Input scheme retrieved successfully.", "data": {
                            "type": "INPUT_SCHEME",
                            "data": input_scheme
                        }}
                        await self.sending(websocket=websocket, message=json.dumps(self.message_scheme(1, "REQUEST", "REQUEST_INPUT_SCHEME", data.get("requestId"), response)))
                    case "REQUEST_RESPONSE":
                        result = await asyncio.to_thread(self.contact_api, type="REQUEST", action="REQUEST_RESPONSE", requestId=data.get("requestId"), plugin=data.get("payload").get("plugin"), payload=data.get("payload").get("data"))


                        response = {"status": "success", "message": "Response sent successfully.", "data": {
                            "type": "RESPONSE",
                            "data": result
                        }}
                        await self.sending(websocket=websocket, message=json.dumps(self.message_scheme(1, "REQUEST", "REQUEST_RESPONSE", data.get("requestId"), response)))
        except websockets.ConnectionClosed:
            pass

    async def _server_run(self):
        self._server_event_loop = asyncio.get_running_loop()
        self._stop_event = asyncio.Event()

        remoteHost = await websockets.serve(self.handler, self.host, self.port)
        if self.run_local:
            localHost = await websockets.serve(self.handler, "127.0.0.1", self.port)

        self.server = [remoteHost, localHost] if self.run_local else [remoteHost]

        self._running = True
        await self._stop_event.wait()

        for srv in self.server:
            srv.close()
            await srv.wait_closed()

        self._running = False

    def start(self):
        if not self._running:
            
            opr.write_log(isFrom="Ophelia - SocketServer", message="WebSocket Server started.", filename="OpheliaServer.log", level="INFO")
            opr.send_toast_notification(app_id="Ophelia Socket Server", title="Socket Server Started", msg="The WebSocket server has been started.", icon_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "Ophelia_Logo.png"))

            self._server_thread = threading.Thread(target=lambda: asyncio.run(self._server_run()), daemon=True)
            self._server_thread.start()
            opr.print_from("Ophelia - SocketServer", message="WebSocket server started successfully.")
        


    def stop(self):        
        if self._running:

            opr.write_log(isFrom="Ophelia - SocketServer", message="WebSocket Server stopped.", filename="OpheliaServer.log", level="INFO")
            opr.send_toast_notification(app_id="Ophelia Socket Server", title="Socket Server Stopped", msg="The WebSocket server has been stopped.", icon_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "Ophelia_Logo.png"))

            self._server_event_loop.call_soon_threadsafe(self._stop_event.set)
            self._server_thread.join()

            if self._running == False:
                message = "WebSocket server stopped successfully."
            else: 
                message = "Failed to stop WebSocket server."
            opr.print_from("Ophelia - SocketServer", message=message)


    def clean_up(self):
        if self._running:
            self.stop()

        opr.save_json(is_from="Ophelia - SocketServer", path=opr.DEFAULT_LOG_PATH, dump={
            "NoOfClients": len(self.logs),
            "WebSocketServerLogs": self.logs
        }, filename=f"SocketServer{datetime.datetime.now().date()}.log")


        








