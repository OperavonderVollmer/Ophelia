import psutil
import json
import secrets
import subprocess
import sys
import platform
import tempfile
import asyncio
from OperaCryptography import OperaCryptography
import threading
import base64

class InterfaceDiscover:
    
    def __init__(self): 
        self.one_time_token = None
        self.states = ["IDLE","DISCOVERY", "PAIRING", "BOUND", "ERROR"]
        self.state = self.states[0]
        self.HybridCrypt = OperaCryptography.HybridCryptoEngine()
        self.bound = False


    def start(self):

        self.one_time_token = secrets.token_urlsafe(32)
        encrypted_token = self.HybridCrypt.encrypt(self.one_time_token.encode('utf-8'))
        print(f"One-time token: {self.one_time_token} | Encrypted token: {encrypted_token}") # TODO: Remove printing sensitive info after testing
        string_token = base64.urlsafe_b64encode(encrypted_token).decode("ascii")

        pairing_data = self.generate_pairing_data(string_token, flatten=True)
        
        self.display_qr_in_new_terminal(pairing_data)

        self._start_listening(pairing_data)
 

    def get_interfaces(self, flatten: bool = False, include_loopback: bool = True):
        interfaces = {}
        for name, address in psutil.net_if_addrs().items():
            ipv4_list = [addr.address for addr in address if addr.family.name == 'AF_INET']
            if ipv4_list:
                interfaces[name] = ipv4_list

        if not flatten:
            return interfaces
        else:
            interface_list = []
            for name, ips in interfaces.items():
                for ip in ips:
                    if ip != '127.0.0.1':
                        interface_list.append({'name': name, 'ip': ip})

            if include_loopback:
                interface_list.append({'name': 'localhost', 'ip': '127.0.0.1'})

            return interface_list 
    
    
    def generate_pairing_data(self, encrypted_token, interfaces = None, port=8080, **kwargs):

        if interfaces is None:
            interfaces = self.get_interfaces(**kwargs)
        
        return  {
            'interfaces': interfaces,
            'port': port,
            'token': encrypted_token
        }

    
    def display_qr_in_new_terminal(self, pairing_data):

# TODO: Remove printing sensitive info after testing
        qr_script = f'''
import qrcode
import json
import sys

data = {repr(json.dumps(pairing_data))}

# Smaller QR code settings
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=1,
    border=1,
)

qr.add_data(data)
qr.make(fit=True)

print("\\n" + "="*40)
print("SCAN TO CONNECT")
print("="*40 + "\\n")

qr.print_ascii(invert=True)

print("\\n" + "="*40)
index = 1
for iface in {repr(pairing_data['interfaces'])}:
    print(f"[{{index}}] {{iface['name']}}: {{iface['ip']}}")
    index += 1
print("="*40)

print(f"Data: {{data}}")

print("\\nYou may now close this window...")
while True:
    input("")
'''
     

        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(qr_script)
            script_path = f.name

            python_exe = sys.executable
    
        system = platform.system()
        
        if system == 'Windows':
            cmd = f'{python_exe} {script_path}'
            subprocess.Popen(['cmd', '/c', 'start', 'cmd', '/k', cmd], shell=False)

        elif system == 'Darwin': 
            cmd = f'"{python_exe}" "{script_path}"'
            subprocess.Popen(['osascript', '-e', f'tell app "Terminal" to do script {cmd}'])

        elif system == 'Linux':
            terminals = ['gnome-terminal', 'xterm', 'konsole', 'xfce4-terminal']
            for term in terminals:
                try:
                    if term == 'gnome-terminal':
                        subprocess.Popen([term, '--', python_exe, script_path])
                    else:
                        subprocess.Popen([term, '-e', f'{python_exe} {script_path}'])
                    break
                except FileNotFoundError:
                    continue
        
        return script_path
    
    
    def _start_listening(self, pairing_data):
        

        def _run_event_loop(pairing_data):
            asyncio.run(self._listen_all(pairing_data))


        thread = threading.Thread(target=_run_event_loop, args=(pairing_data,), daemon=True)
        thread.start()

        print("Listening for incoming connections...")
        
    
    async def _listen(self, iface, stop_event):
        
        try:
            async def client_handler(reader, writer):
                await self._handle_client(reader, writer, stop_event, self.found_device_callback)
            
            server = await asyncio.start_server(
                client_handler,  
                iface['interface'], 
                iface['port']
            )
        
            async with server:
                await stop_event.wait()
                
        except OSError as e:
            pass
        except Exception as e:
            print(f"Failed to start server on {iface['interface']} - {e}")
    
    async def _listen_all(self, pairing_data):
        interfaces = pairing_data['interfaces']
        port = pairing_data['port']

        stop_event = asyncio.Event()

        tasks = []
        for iface in interfaces:
            tasks.append(self._listen({'interface': iface['ip'], 'port': port}, stop_event))

        await asyncio.gather(*tasks)

    
    async def _handle_client(self, reader, writer, stop_event, found_device_callback):
        """

        Intended Behavior: 
        After connection, verify the token, and close all other listeners upon successful binding.
        
        """
        addr = writer.get_extra_info('peername')
        print(f"Connection from {addr}")
        try:
            data = await asyncio.wait_for(reader.read(1024), timeout=10)
            
            message = data.decode("ascii")
            cipher_bytes = base64.urlsafe_b64decode(message)
            decrypted = self.HybridCrypt.decrypt(cipher_bytes).decode("utf-8")
        except Exception:
            writer.write(b'FAILURE')
            await writer.drain()
            writer.close()
            await writer.wait_closed()
            return



        if not getattr(self, 'bound', False) and decrypted == self.one_time_token:
            self.bound = True
            writer.write(b'SUCCESS')
            await writer.drain()
            stop_event.set()  # shut down all listeners
            found_device_callback(addr)
        else:
            writer.write(b'FAILURE')
            await writer.drain()

        writer.close()
        await writer.wait_closed()

    def found_device_callback(self, device_info):
        print(f"Device found: {device_info}!")


if __name__ == "__main__":
    discoverer = InterfaceDiscover()
    discoverer.start()

    while True:
        input("Press enter to exit...")
        break

    print("Goodbye!")

# Need to implement server handling logic
# Need to encrypt communication using the token
# Need to decrypt communication using the token


