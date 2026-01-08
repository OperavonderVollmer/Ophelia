import psutil
import qrcode
import json
import secrets
import subprocess
import sys
import platform
import tempfile
import asyncio


class InterfaceDiscover:
    
    def __init__(self): pass

    @staticmethod
    def get_interfaces(flatten: bool = False, include_loopback: bool = True):
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
    
    @staticmethod
    def generate_pairing_data(token, interfaces = None, port=8080, **kwargs):

        if interfaces is None:
            interfaces = InterfaceDiscover.get_interfaces(**kwargs)
        
        return  {
            'interfaces': interfaces,
            'port': port,
            'token': token
        }

    @staticmethod
    def display_qr_in_new_terminal(pairing_data):

        qr_script = f'''
import qrcode
import json

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

input("\\nPress Enter to close...")
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
    
    @staticmethod
    def start_listening(token, pairing_data = None):
        if pairing_data is None:
            pairing_data = InterfaceDiscover.generate_pairing_data(token, flatten=True)

        asyncio.run(InterfaceDiscover._listen_all(pairing_data))
        
    @staticmethod
    async def _listen(iface, stop_event):
        
        try:
            async def client_handler(reader, writer):
                await InterfaceDiscover._handle_client(reader, writer, stop_event)
            
            server = await asyncio.start_server(
                client_handler,  
                iface['interface'], 
                iface['port']
            )
        
            async with server:
                await stop_event.wait()
                
        except Exception as e:
            print(f"Failed to start server on {iface['interface']}:{iface['port']} - {e}")

    @staticmethod
    async def _listen_all(pairing_data):
        interfaces = pairing_data['interfaces']
        port = pairing_data['port']

        stop_event = asyncio.Event()


        tasks = []
        for iface in interfaces:
            tasks.append(InterfaceDiscover._listen({'interface': iface['ip'], 'port': port}, stop_event))

        await asyncio.gather(*tasks)

    @staticmethod
    async def _handle_client(reader, writer, stop_event):
        addr = writer.get_extra_info('peername')
        # log connection

        data = await reader.read(1024)
        message = data.decode()
        # log message

        writer.write(b'') #TODO: send response 
        await writer.drain()

        writer.close()
        await writer.wait_closed()

        # log disconnection
        stop_event.set()



if __name__ == "__main__":
    token = secrets.token_urlsafe(32)
    pairing_data = InterfaceDiscover.generate_pairing_data(token, port=8080)
    InterfaceDiscover.display_qr_in_new_terminal(pairing_data)



# Need to implement server handling logic
# Need to encrypt communication using the token
# Need to decrypt communication using the token


