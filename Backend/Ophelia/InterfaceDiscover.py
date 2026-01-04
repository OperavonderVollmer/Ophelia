import psutil
import qrcode
import json
import secrets
import subprocess
import sys
import platform
import tempfile
import os

def get_interfaces():
    interfaces = {}
    for name, addrs in psutil.net_if_addrs().items():
        ipv4_list = [addr.address for addr in addrs if addr.family.name == 'AF_INET']
        if ipv4_list:
            interfaces[name] = ipv4_list
    return interfaces

def generate_pairing_data(port=8080):
    """Generate pairing data with interfaces"""
    interfaces = get_interfaces()
    
    # Flatten to list of IPs
    interface_list = []
    for name, ips in interfaces.items():
        for ip in ips:
            if ip != '127.0.0.1':
                interface_list.append({'name': name, 'ip': ip})
    
    interface_list.append({'name': 'localhost', 'ip': '127.0.0.1'})
    
    pairing_data = {
        'interfaces': interface_list,
        'port': port,
        'token': secrets.token_urlsafe(32)
    }
    
    return pairing_data

def display_qr_in_new_terminal(pairing_data):
    """Create a new terminal window with QR code"""
    
    # Create a Python script that will run in the new terminal
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
for iface in {repr(pairing_data['interfaces'])}:
    print(f"{{iface['name']}}: {{iface['ip']}}")
print("="*40)

input("\\nPress Enter to close...")
'''
    
    # Save script to temp file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(qr_script)
        script_path = f.name
    
    # Get the Python executable from current environment
    python_exe = sys.executable
    
    # Open new terminal based on OS
    system = platform.system()
    
    if system == 'Windows':
        # Use proper escaping for Windows
        cmd = f'{python_exe} {script_path}'
        subprocess.Popen(['cmd', '/c', 'start', 'cmd', '/k', cmd], shell=False)
    elif system == 'Darwin':  # macOS
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

# Usage
if __name__ == "__main__":
    print("Generating pairing QR code...")
    
    pairing_data = generate_pairing_data()
    
    # Display in new terminal
    script_path = display_qr_in_new_terminal(pairing_data)
    
    print(f"\n✓ QR code displayed in new terminal")
    print(f"Pairing token: {pairing_data['token'][:16]}...")
    print("\nAvailable interfaces:")
    for iface in pairing_data['interfaces']:
        print(f"  • {iface['name']}: {iface['ip']}")
    
    print("\nWaiting for clients to connect...")