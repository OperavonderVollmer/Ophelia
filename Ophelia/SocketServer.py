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
    """
    # WebSocket Server for remote communication with Ophelia.

    To accommodate every plugin, the handler is expecting a dictionary with the following structure:
    {
        "version": 1,
        "type": "REQUEST" or "EVENT",
        "action": "REQUEST_PLUGINS", "REQUEST_INPUT_SCHEME", "REQUEST_RESPONSE"
        "requestId": "1234",
        "payload": {}
    }


    """

    def __init__(self, host, port, api_url="http://127.0.0.1:6980"):
        self.host = host
        self.port = port
        self.api_url = api_url
        self.server = None
        self._running = False
        self._server_thread = None
        self._server_event_loop = None
        self._stop_event = None
        self._fully_booted = False
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
            plugin_name = kwargs.get("PLUGIN_NAME") or payload.get("PLUGIN_NAME")
            to_ship = {
                "PLUGIN_NAME": plugin_name,
                "payload": payload
            }
            if request == "EVENT":
                opr.write_log(isFrom="Ophelia - SocketServer", message=f"EVENT: {action} - {payload}", level="INFO", filename="OpheliaServer.log")
            else:
                response = requests.post(f"{self.api_url}/{action}", json=to_ship)
                return response.json()
        except requests.exceptions.RequestException as e:
            opr.error_pretty(exc=e, name="Ophelia - SocketServer", message="Failed to contact API.")

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
                    await websocket.send(json.dumps(self.message_scheme(1, "RESPONSE", "ERROR", data.get("requestId"), response)))
                    continue
                    
                match data["action"]:
                    case "REQUEST_PLUGINS":
                        plugin_list = ["Plugin 1", "Plugin 2", "Plugin 3"] # TODO: Get the list of plugins from the PluginManager
                        response = {"status": "success", "message": "Plugins retrieved successfully.", "payload": plugin_list}
                        await websocket.send(json.dumps(self.message_scheme(1, "RESPONSE", "REQUEST_PLUGINS", data.get("requestId"), response)))
                    case "REQUEST_INPUT_SCHEME":
                        
                        input_scheme = await asyncio.to_thread(CallableAPI.get_input_scheme, data.get("PLUGIN_NAME"))
                        response = {"status": "success", "message": "Input scheme retrieved successfully.", "payload": {
                            "type": "INPUT_SCHEME",
                            "data": input_scheme.serialize()
                        }}
                        await websocket.send(json.dumps(self.message_scheme(1, "RESPONSE", "REQUEST_INPUT_SCHEME", data.get("requestId"), response)))
                    case "REQUEST_RESPONSE":
                        # result = await asyncio.to_thread(CallableAPI.execute, data.get("payload").get("plugin")) # Yet to be implemented - Sends the data to CallableAPI for processing

                        result = "This feature is under development."

                        response = {"status": "success", "result": result}
                        await websocket.send(json.dumps(response))
                
        except websockets.ConnectionClosed:
            pass

    async def _server_run(self):
        self._server_event_loop = asyncio.get_running_loop()
        self._stop_event = asyncio.Event()

        self.server = await websockets.serve(self.handler, self.host, self.port)

        self._running = True
        await self._stop_event.wait()

        self.server.close()
        await self.server.wait_closed()
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


        
if __name__ == "__main__":
    server = SocketServer("127.0.0.1", 6990)
    server.start()

    input("Press Enter to stop the server: ")
    server.stop()






#
# 
# 
# 
# OKAY. 
# 12 06 2025
# 
# What we want to do is fix the bridge between the websocket server and the api server.
# How do we do that? Fix contact_api
# 
# Scan the kwargs for the url/data needed then call the associated function via the api server.
# 
# 
# 
# 













