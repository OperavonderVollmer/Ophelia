import os, importlib.util, sys, traceback
from OperaPowerRelay import opr
import requests
from dotenv import load_dotenv, set_key
import tempfile, zipfile, shutil
import subprocess
import socket
from datetime import datetime, timezone
from PluginTemplate.PluginTemplate import ophelia_plugin


class PluginManager():
    def __init__(self, verbose=False, user="", on_start:bool=True):
        load_dotenv()
        self.env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
        if not os.path.exists(self.env_path):
            set_key(self.env_path, "GITHUB_USER", user or os.getenv("GITHUB_USER", "OperavonderVollmer"))
        self.verbose = verbose
        self.plugin_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "plugins")
        self.plugins: dict[str, ophelia_plugin] = {}
        self.user = user or os.getenv("GITHUB_USER", "OperavonderVollmer")
        self._past: dict = {
            "found_plugins_no": int(os.getenv("found_plugins_no", 0)),
        }
        self.on_start() if on_start else None
        
    def backup(self):
        for key, value in self._past.items():
            set_key(self.env_path, key, str(value))


    def on_start(self):
        self.load_plugins()
        self._past[f"found_plugins_no"] = len(self.plugins.keys())
        for plugin in self.plugins.keys(): # TODO: remove plugins that are not in the list anymore
            self._past[plugin] = str(os.getenv(plugin, ""))
        opr.print_from(name="Ophelia - PluginManager", message=f"[✔] Loaded {len(self.plugins.keys())} plugin(s)")
        self.update_plugin_list()

    @staticmethod
    def look_for_plugins(user) -> list: # OperavonderVollmer
        url = f"https://api.github.com/users/{user}/repos"
        try:
            repos = requests.get(url).json()
        except requests.exceptions.RequestException as e:
            opr.error_pretty(exc=e, name="Ophelia - PluginManager", message="Failed to retrieve GitHub repositories.")
            return []


        plugins = [
            r for r in repos
            if "opr-oph-plugin" in [t.lower() for t in r.get("topics", [])]
        ]    


        return plugins

    def _plugin_helper(self, plugins):
        choices = []
        for plugin in plugins:
            last_update = datetime.fromisoformat(plugin['pushed_at'].replace("Z", "+00:00"))
            now = datetime.now(timezone.utc)  # also aware

            last_update_delta = now - last_update
            days, seconds = last_update_delta.days, last_update_delta.seconds
            hours = seconds // 3600
            minutes = (seconds % 3600) // 60

            last_update_time = f"{f'{days}d ' if days > 0 else ''}{f'{hours}h ' if hours > 0 else ''}{f'{minutes}m ago' if minutes > 0 else 'just now'}"

            installed_update_str = self._past.get(plugin['name'])

            if installed_update_str:
                installed_update = datetime.fromisoformat(str(installed_update_str).replace("Z", "+00:00"))
            else:
                installed_update = None

            if installed_update is None:
                status = "NEW"
            elif last_update > installed_update:
                delta = last_update - installed_update
                days, seconds = delta.days, delta.seconds
                hours = seconds // 3600
                minutes = (seconds % 3600) // 60
                
                status = f"UPDATE AVAILABLE (Installed update was pushed {days}d {hours}h {minutes}m ago)"
            else:
                status = "FULLY UPDATED"

            choices.append(f"{plugin['name']} - Last update {last_update.date()} ({last_update_time}) - {status}")

        return choices

    def update_plugin_list(self):
        plugins = self.look_for_plugins(self.user)
        if self._past["found_plugins_no"] < len(plugins):
            opr.print_from(name="Ophelia - Update Plugins", message=f"[✔] Found {len(plugins) - self._past.get('found_plugins_no', 0)} new plugins!")

        try:
            while True:
                choices = self._plugin_helper(plugins)
                opr.list_choices(choices=choices, title="Ophelia - Update Plugins", after_return_count=1)
                plugin_choice = opr.input_from(name="Ophelia - Update Plugins", message=f"Select plugin [1-{len(plugins)}] to (re)install or 0 to exit").strip()
                if plugin_choice == "0":
                    break
                plugin = plugins[int(plugin_choice)-1]
                result = self.download_plugin(plugin)
                if result:
                    self._past[plugin["name"]] = plugin['pushed_at']
                self.load_plugins()
        except (KeyboardInterrupt, IndexError, ValueError, KeyError):
            opr.print_from(name="Ophelia - Update Plugins", message=f"[✖] Exiting plugin selection...", return_count=1)
            pass
                
            

        if self.verbose:
            opr.print_from(name="Ophelia - Update Plugins", message=f"[✔] {len(self.plugins)} out of {len(plugins)} from {self.user} are already installed.")

        self._past["found_plugins_no"] = len(plugins)
        os.environ["found_plugins_no"] = str(self._past["found_plugins_no"])
        self.backup()

        return plugins

    def get_input_scheme(self, PLUGIN_NAME): return self.plugins[PLUGIN_NAME].input_scheme(True)

    def get_plugin_list(self): return list(self.plugins.keys())

    def download_plugin(self, plugin) -> bool:
        temp_dir = tempfile.mkdtemp()
        output = os.path.join(temp_dir, f"{plugin['name']}.zip")
        zip_url = f"https://api.github.com/repos/{self.user}/{plugin['name']}/zipball/main"

        try:
            # STEP 1 — download zip
            try:
                response = requests.get(zip_url)
                response.raise_for_status()

                with open(output, "wb") as f:
                    f.write(response.content)

                opr.print_from(name="Ophelia - PluginManager - Download Plugin", message=f"[✔] Downloaded plugin: {plugin['name']}")

            except Exception as e:
                opr.error_pretty(exc=e, name="Ophelia - PluginManager - Download Plugin", message=f"[✖] Failed to download plugin: {plugin['name']}")
                return False

            # STEP 2 — extract
            try:
                with zipfile.ZipFile(output, "r") as zip_ref:
                    zip_ref.extractall(temp_dir)

                opr.print_from(name="Ophelia - PluginManager - Download Plugin", message=f"[✔] Extracted plugin: {plugin['name']}")

            except Exception as e:
                opr.error_pretty(exc=e, name="Ophelia - PluginManager - Download Plugin", message=f"[✖] Failed to extract plugin: {plugin['name']}")
                return False
            finally:
                # remove zip no matter what
                os.remove(output)

            # STEP 3 — install
            extracted_root = next(os.scandir(temp_dir)).path
            inner_plugin = os.path.join(extracted_root, plugin['name'])
            requirements_path = os.path.join(extracted_root, "requirements.txt")
            dest_path = os.path.join(self.plugin_dir, plugin['name'])

            try:
                if os.path.exists(dest_path):
                    shutil.rmtree(dest_path)

                shutil.move(inner_plugin, dest_path)
                opr.print_from(name="Ophelia - PluginManager - Download Plugin", message=f"[✔] Installed plugin: {plugin['name']}")

            except Exception as e:
                opr.error_pretty(exc=e, name="Ophelia - PluginManager - Download Plugin", message=f"[✖] Failed to install plugin: {plugin['name']}")
                return False

            # STEP 4 — requirements
            try:
                if os.path.exists(requirements_path): # TODO: Remove comments
                    # subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", requirements_path])
                    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", requirements_path, "--force-reinstall"])
                    opr.print_from(name="Ophelia - PluginManager - Download Plugin", message=f"[✔] Installed plugin requirements: {plugin['name']}")
            except Exception as e:
                opr.error_pretty(exc=e, name="Ophelia - PluginManager - Download Plugin", message=f"[✖] Failed to install plugin requirements. Please install them manually: {plugin['name']}")
                return False

            # success
            opr.print_from(name="Ophelia - PluginManager - Download Plugin", message=f"[✔] Finished installing {plugin['name']} to {self.plugin_dir}\\{plugin['name']}")
            opr.print_from(name="Ophelia - PluginManager - Download Plugin", message=f"New files added to {dest_path}: {', '.join(os.listdir(dest_path))}")

            return True

        finally:
            shutil.rmtree(temp_dir)
            opr.print_from(name="Ophelia - PluginManager - Download Plugin", message=f"[✔] Cleaned up temp directory: {temp_dir}")



    def load_plugins(self) -> dict:
        plugins = {}    
        for root, dirs, files in os.walk(self.plugin_dir):
            for fileName in files:
                if fileName.endswith("Plugin.py"):
                    pluginName = fileName[:-9]  # remove "Plugin.py"
                    pluginPath = os.path.join(root, fileName)

                    try:
                        spec = importlib.util.spec_from_file_location(pluginName, pluginPath)
                        if spec is None or spec.loader is None:
                            raise ImportError
                        module = importlib.util.module_from_spec(spec)
                        spec.loader.exec_module(module)

                        if not hasattr(module, "get_plugin"):
                            if self.verbose:
                                opr.print_from(name="Ophelia - PluginManager", message=f"[⚠] {pluginName}: No get_plugin() function found.")                            
                                continue

                        instance = module.get_plugin()
                        if pluginName in plugins:
                            if self.verbose:
                                opr.print_from(name="Ophelia - PluginManager", message=f"[⚠] Duplicate plugin name: {pluginName}. Overwriting.")

                        plugins[pluginName] = instance
                        if self.verbose:
                            opr.print_from(name="Ophelia - PluginManager", message=f"[✔] Loaded plugin: {pluginName}")

                    except Exception as e:
                        opr.print_from(name="Ophelia - PluginManager", message=f"[✖] Failed to load plugin '{fileName}': {e}")
                        if self.verbose:
                            traceback.print_exc()
                        continue
        
        self.plugins = plugins
        return plugins


    def execute_plugin(self, PLUGIN_NAME: str = None, payload: dict = None):
        if not PLUGIN_NAME:
            try:
                while True:                
                    opr.list_choices(choices=list(self.plugins.keys()), title="[Ophelia - Execute Plugin]", after_return_count=1)
                    input = opr.input_from(name="Ophelia - Execute Plugin", message=f"Select plugin [{1}/{len(self.plugins)}]")
                    PLUGIN_NAME = list(self.plugins.keys())[int(input) - 1] 
                    break
            except IndexError:
                opr.print_from(name="Ophelia - Execute Plugin", message=f"[✖] Invalid input, try again")
                pass
            except (KeyboardInterrupt, ValueError, KeyError):
                opr.print_from(name="Ophelia - Execute Plugin", message=f"[✖] Exiting plugin selection...")
                return
            except Exception as e:
                opr.error_pretty(exc=e, name="Ophelia - Execute Plugin", message=f"Failed to select plugin: {e}")
                return

        self.plugins[PLUGIN_NAME].execute(payload) # type: ignore

    def clean_up(self):
        for plugin in self.plugins.values():
            plugin.clean_up()