from Ophelia import PluginManager
from OperaPowerRelay import opr
import os, sys
root = os.path.dirname(os.path.abspath(__file__))
if root not in sys.path:
    sys.path.insert(0, root)
import SocketServer
import CallableAPI


VERSION = 1

def main():
    opr.print_from(name="Ophelia", message="Welcome to Ophelia!")
    PM = PluginManager.PluginManager(on_start=True)
    CA = CallableAPI.CallableAPI(PluginManager=PM, host="127.0.0.1", port=6980, version=VERSION)
    SS = SocketServer.SocketServer("127.0.0.1", 6990)

    SS.start()
    CA.start()
       
    while True:
        try:
            opr.print_from(name="Ophelia", message="Enter to interact with Ophelia, Ctrl+C to exit.", return_count=1)
            input("")
            PM.execute_plugin()
        except KeyboardInterrupt:
            break
        except Exception as e:
            print("\033[91mERROR:\033[0m", e)
            break

    PM.clean_up()
    SS.stop()
    CA.stop()
    opr.print_from(name="Ophelia", message="Goodbye!")



if __name__ == "__main__":
    main()