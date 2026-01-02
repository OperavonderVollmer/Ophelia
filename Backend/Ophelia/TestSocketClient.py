import asyncio
import websockets
import json 
import os, sys
root = os.path.dirname(os.path.abspath(__file__))
if root not in sys.path:
    sys.path.insert(0, root)
from PluginTemplate import PluginTemplate

class TestSocketClient:
    def __init__(self, uri):
        self.uri = uri
        self.ws = None
        
    async def connect(self):
        self.ws = await websockets.connect(self.uri)
        print(f"Connected to {self.uri}")


    async def send(self, data: dict):
        await self.ws.send(json.dumps(data))

    async def recv(self):
        msg = await self.ws.recv()
        return json.loads(msg)

    async def request(self, plugin, command, args=None):
        packet = {
            "PLUGIN_NAME": plugin,
            "COMMAND": command,
            "ARGS": args or {}
        }
        await self.send(packet)
        return await self.recv()

    async def close(self):
        await self.ws.close()

async def main():
    client = TestSocketClient("ws://127.0.0.1:6990")
    await client.connect()

    result = await client.request("TestPlugin", "Ping")
    print(result)

    await client.close()

    # client =  TestSocketClient("ws://127.0.0.1:6990")
    # await client.connect()

    # message = PluginTemplate.ophelia_input.DEFAULT_BROWSER_PROMPT.serialize()

    # print(message)
    # result = await client.send(message)
    # print(result)

    # await client.close()

if __name__ == "__main__":
    asyncio.run(main())
    input("Press Enter to exit: ")