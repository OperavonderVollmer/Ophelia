import uvicorn
from fastapi import FastAPI, Body
from OperaPowerRelay import opr
import threading
import os, sys
root = os.path.dirname(os.path.abspath(__file__))
if root not in sys.path:
    sys.path.insert(0, root)
import PluginManager as PM

class CallableAPI:
    


    def __init__(self, PluginManager, host="127.0.0.1", port=6980, version: int=1):
        self.host = host
        self.port = port
        self.version = version
        self.PluginManager: PM.PluginManager = PluginManager
        self.server = None
        self.thread = None
        self.fastapi_app = FastAPI()

        @self.fastapi_app.get("/")
        def root(body: dict):
            opr.write_log(isFrom="Ophelia - CallableAPI", message=f"Ophelia API connected. Request ID: {body.get("requestId", 0)}", filename="OpheliaServer.log", level="INFO")
            return []

        @self.fastapi_app.post("/REQUEST_PLUGINS")
        def get_plugin_list(body: dict):
            opr.write_log(isFrom="Ophelia - CallableAPI", message=f"Requesting plugin list. Request ID: {body.get("requestId", 0)}", filename="OpheliaServer.log", level="INFO")
            return [self.PluginManager.get_plugin_list()]

        @self.fastapi_app.post("/REQUEST_INPUT_SCHEME")
        def input_scheme(body: dict):
            opr.write_log(isFrom="Ophelia - CallableAPI", message=f"Requesting input scheme for {body.get("plugin", None)}. Request ID: {body.get("requestId", 0)}", filename="OpheliaServer.log", level="INFO")
            scheme = self.PluginManager.get_input_scheme(body.get("plugin", None))
            print(f"Input scheme for {body.get('plugin', None)}: {scheme}")
            return [scheme]
        
        @self.fastapi_app.post("/REQUEST_RESPONSE")
        def execute_plugin(body: dict):
            opr.write_log(isFrom="Ophelia - CallableAPI", message=f"Executing plugin {body.get("plugin", None)}. Request ID: {body.get("requestId", 0)}", filename="OpheliaServer.log", level="INFO")
            scheme = self.PluginManager.execute_plugin(PLUGIN_NAME=body.get("plugin", None), payload=body.get("payload", {}))
            print(f"Response for {body.get('plugin', None)}: {scheme}")
            return [scheme]

    def start(self):
        
        config = uvicorn.Config(self.fastapi_app, host=self.host, port=self.port, log_level="info")
        self.server = uvicorn.Server(config)

        # Run Uvicorn in a separate thread
        self.thread = threading.Thread(target=self.server.run, daemon=True)
        self.thread.start()
        self.server.should_exit = False

    def stop(self):
        if self.server and self.server.should_exit is False:
            self.server.should_exit = True  
            self.thread.join()             # pyright: ignore[reportOptionalMemberAccess]
    
