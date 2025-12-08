import ast
import sys
import os
import subprocess
import shutil
import urllib.request
import zipfile
import tempfile

import ast

def get_package_details(setup_path: str) -> tuple[str, bool]:
    """
    Returns (package_name, needs_git) where needs_git is True if any dependency
    in install_requires or dependency_links uses a git URL.
    """
    import ast

    with open(setup_path, "r", encoding="utf-8") as f:
        node = ast.parse(f.read(), filename=setup_path)

    name = "Unnamed Package"
    needs_git = False

    class GitFinder(ast.NodeVisitor):
        def visit_Constant(self, n: ast.Constant):
            # works for Python 3.8+
            if isinstance(n.value, str) and ("git+" in n.value or "@ git+" in n.value):
                nonlocal needs_git
                needs_git = True

        def visit_Str(self, n: ast.Str):
            # backwards compatibility
            if "git+" in n.s or "@ git+" in n.s:
                nonlocal needs_git
                needs_git = True

    git_finder = GitFinder()
    git_finder.visit(node)

    for stmt in node.body:
        if isinstance(stmt, ast.Expr) and isinstance(stmt.value, ast.Call):
            func = stmt.value.func
            if getattr(func, "id", "") == "setup":
                for kw in stmt.value.keywords:
                    if kw.arg == "name":
                        try:
                            name = ast.literal_eval(kw.value)
                        except Exception:
                            name = "Unnamed Package"

    return name, needs_git


def create_virtual_environment():
    print("Creating virtual environment...")
    if os.path.exists("venv"):
        print("\033[93mNOTICE:\033[0m venv already exists, skipping creation")
        return
    try:
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
        print("\033[92mSUCCESS\033[0m")
    except Exception as e:
        print("\033[91mERROR:\033[0m", e)
        raise


NO_GIT_FLAG = False
GIT_PATH = ""
def has_git():
    print("Checking for git...")
    global NO_GIT_FLAG
    try:    
        subprocess.run(["git", "--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("\033[92mSUCCESS\033[0m: Git has been found")
        return True
    except FileNotFoundError:
        print("\033[94mINFO\033[0m: Git not found")
        NO_GIT_FLAG = True
        return False
    


def install_temp_git():
    if not has_git():
        
        global GIT_PATH
        print("\n\nTemporarily Installing Git...")

        temp_dir = tempfile.mkdtemp()
        portable_git_exe = os.path.join(temp_dir, "PortableGit.exe")
        url = "https://github.com/git-for-windows/git/releases/download/v2.51.1.windows.1/PortableGit-2.51.1-64-bit.7z.exe"

        print("Downloading Portable Git...")
        try:
            urllib.request.urlretrieve(url, portable_git_exe)
            print("\033[92mSUCCESS\033[0m")
        except Exception as e:
            print("\033[91mERROR:\033[0m", e)
            raise


        portable_git_temp_dir = os.path.join(temp_dir, "PortableGit")
        
        GIT_PATH = portable_git_temp_dir

        print(f"Installing Portable Git to {portable_git_temp_dir}")
        print("\033[93mNOTICE:\033[0m A small window will appear — please press OK to continue.")

        try:
            subprocess.run([
                portable_git_exe,
                f'/DIR={portable_git_temp_dir}',
                '/VERYSILENT',
                '/NORESTART'
            ], check=True)
            git_bin = os.path.join(portable_git_temp_dir, "cmd")
            os.environ["PATH"] = f"{git_bin};" + os.environ["PATH"]
            print("\033[92mSUCCESS\033[0m")
        except Exception as e:
            print("\033[91mERROR:\033[0m", e)
            raise
        


def clean_temp_git(path):
    if path and os.path.exists(path):
        print(f"Cleaning up PortableGit from {path}")
        try:
            shutil.rmtree(path, ignore_errors=True)
            print("\033[92mSUCCESS\033[0m")
        except FileNotFoundError:
            pass
        except Exception as e:
            print("\033[91mERROR:\033[0m", e)
            raise



def install_requirements():
    print("\n\nInstalling requirements...")
    pip_path = os.path.join("venv", "Scripts", "pip.exe")    
    env = os.environ.copy()
    global GIT_PATH
    if GIT_PATH:
        subprocess.run(["where", "git"], env=env)
        git_cmd = os.path.join(GIT_PATH, "cmd")
        git_usr_bin = os.path.join(GIT_PATH, "usr", "bin")
        git_mingw_bin = os.path.join(GIT_PATH, "mingw64", "bin")
        env["PATH"] = f"{git_cmd};{git_usr_bin};{git_mingw_bin};" + env["PATH"]
    try:
        subprocess.run(
        [pip_path, "install", "-r", "requirements.txt"],
        check=True,
        env=env,
        stdout=subprocess.DEVNULL,  # Optional: silence pip too
        stderr=subprocess.DEVNULL   # Optional: silence pip errors
        )
        print("\033[92mSUCCESS\033[0m")
    except subprocess.CalledProcessError as e:
        print("\033[91mERROR:\033[0m", e)
        raise

def create_quickstart_bat(script_name):
    """
    Creates a Windows batch file that runs quickstart.py from its own directory.
    """
    bat_contents = rf"""@echo off
setlocal

cd /d "%~dp0"

title {script_name}

start "" ".\venv\Scripts\python.exe" ".\main.py"
"""
    path = f"start {script_name}.bat"
    with open(path, "w", encoding="utf-8", newline="\r\n") as f:
        f.write(bat_contents)
    print(f"\033[92mSUCCESS:\033[0m {path} created")


def main():

    script_name, needs_git = get_package_details("setup.py")
    
    
    print(f"\033[91mNOTICE:\033[0m This script will install the necessary files for \033[94m{script_name}\033[0m. This will create a virtual environment to contain these files and dependants, without modifying your system.{' This script will also install git temporarily if absent.' if needs_git else ''}\n\n")

    success = False

    while True:
        _ = input("Continue? (y/n) ").lower()
        if _ == "y":
            break
        else:
            input("Press enter to exit...")
            sys.exit()

    try:
        create_virtual_environment()
        if needs_git:
            install_temp_git()
        install_requirements()
        success = True

    except Exception as e:
        pass

    finally:
        global NO_GIT_FLAG
        global GIT_PATH
        if NO_GIT_FLAG:
            clean_temp_git(GIT_PATH)

    if success:
        try:
            create_quickstart_bat(script_name)
            input("\n\n\033[92mSUCCESS\033[0m: Virtual Environment and Requirements Installed. Press enter to exit...")
            sys.exit()
        except Exception as e:
            pass
    
    input(f"\n\n\033[91mFAILED:\033[0m: {script_name} failed to install. Press enter to exit...")


if __name__ == "__main__":
    main()