import subprocess
import sys
import os
import shutil

def install_pyinstaller():
    """Install PyInstaller if it's not already installed."""
    try:
        import PyInstaller
    except ImportError:
        print("PyInstaller not found. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pyinstaller"])

def build_application():
    """Build the application using PyInstaller."""
    print("Building the application...")
    app_path = os.path.join("app", "main.py")
    subprocess.check_call([
        "pyinstaller", 
        "--onefile", 
        "--add-data", "app:app",  # Include the app directory
        app_path
    ])

def copy_built_file():
    """Copy the built executable to the electron project build/python-api folder."""
    # Determine the correct executable extension based on the platform
    if sys.platform.startswith('win'):
        built_file = "main.exe" # Windows
    else:
        built_file = "main" # Linux, MacOS
    
    #Construct the source path and destination path
    source = os.path.join("dist", built_file)
    destination_dir = os.path.join("..", "electron", "build", "python-api")
    destination = os.path.join(destination_dir, built_file)
    
    # Create the destination directory if it doesn't exist
    if not os.path.exists(destination_dir):
        os.makedirs(destination_dir)
    
    print(f"Copying {source} to {destination}...")
    shutil.copy(source, destination)

if __name__ == "__main__":
    install_pyinstaller()
    build_application()
    copy_built_file() 