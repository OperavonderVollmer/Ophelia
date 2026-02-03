from OperaPowerRelay import opr
import os, sys
root = os.path.dirname(os.path.abspath(__file__))
if root not in sys.path:
    sys.path.insert(0, root)
import SocketServer
import CallableAPI
import PluginManager
import InterfaceDiscover

VERSION = 1
interfaceDiscoverFlag = True
streamline = True
def main():
    
    opr.print_from(name="Ophelia", message="Welcome to Ophelia!")
    PM = PluginManager.PluginManager(on_start=True, skip_update=streamline)

    if interfaceDiscoverFlag:

        ID = InterfaceDiscover.InterfaceDiscover()
        ID.start()



        peer = ID.wait_for_discovery()
        print("Discovered interface:", peer["IP"], peer["Port"])
        CA = CallableAPI.CallableAPI(PluginManager=PM, host=peer["IP"], port=6980, version=VERSION)
        SS = SocketServer.SocketServer(peer["IP"], 6990, api_url=CA.api_url(), run_local=False) # TODO: Remove run_local

    else:        
        CA = CallableAPI.CallableAPI(PluginManager=PM, host="127.0.0.1", port=6980, version=VERSION)
        SS = SocketServer.SocketServer("127.0.0.1", 6990, api_url=CA.api_url())

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