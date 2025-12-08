import uvicorn
from fastapi import FastAPI, Depends
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
        def root(requestId: int = 1):
            return self.message_scheme(requestId=requestId, type="REQUEST", action="", payload={"status": "success", "message": "Ophelia API is running."})

        @self.fastapi_app.get("/REQUEST_PLUGINS")
        def get_plugin_list(requestId: int = 1):
            return self.message_scheme(requestId=requestId, type="REQUEST", action="REQUEST_PLUGINS", payload=self.PluginManager.get_plugin_list())

        @self.fastapi_app.post("/REQUEST_INPUT_SCHEME")   
        def input_scheme(requestId: int = 1, PLUGIN_NAME: str = None):
            return self.message_scheme(requestId=requestId, type="REQUEST", action="REQUEST_INPUT_SCHEME", payload=self.PluginManager.get_input_scheme(PLUGIN_NAME))
        
        @self.fastapi_app.post("/REQUEST_RESPONSE")
        def execute_plugin(requestId: int = 1, PLUGIN_NAME: str = None, payload: dict = None):
            return self.message_scheme(requestId=requestId, type="REQUEST", action="REQUEST_RESPONSE", payload=self.PluginManager.execute_plugin(PLUGIN_NAME, payload))     


    def message_scheme(self, requestId: int, version: int = None, type: str = None, action: str = None, payload: dict = None):
        return {
            "version": version or self.version,
            "type": type or "EVENT",
            "action": action or "ERROR",
            "requestId": requestId,
            "payload": payload or {}
        }

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
    
