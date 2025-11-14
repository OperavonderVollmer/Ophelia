from Ophelia import PluginManager
from OperaPowerRelay import opr

PM = PluginManager.PluginManager(verbose=True)

plugins = PM.look_for_plugins("OperavonderVollmer")


def main():
    main_loop()

def main_loop():
    opr.print_from(name="Ophelia", message="Welcome to Ophelia!")
    PM.on_start()    
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
    opr.print_from(name="Ophelia", message="Goodbye!")



if __name__ == "__main__":
    main()