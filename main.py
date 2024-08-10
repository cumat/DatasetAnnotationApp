from backend.app import App
from dataset.dataset import Dataset
from plugin import get_dataset

import argparse

parser = argparse.ArgumentParser(description="Process some integers.")    
# Add an argument for port with a default value
parser.add_argument(
    '--port', 
    type=int, 
    default=5000, 
    help='Port number to run the server on (default: 5000)'
)

# Parse the command line arguments
args = parser.parse_args()

# Access the port argument
port = args.port


import pkgutil
import importlib
import os

def import_all_modules_from_package(package_name):
    package = importlib.import_module(package_name)
    package_path = package.__path__
    
    for _, module_name, _ in pkgutil.iter_modules(package_path):
        module_full_name = f"{package_name}.{module_name}"
        importlib.import_module(module_full_name)
        print(f"Imported module: {module_full_name}")

if __name__ == '__main__':
    # get dataset
    dataset = get_dataset()
    # initialize app
    app = App(__name__, './frontend', dataset)
    # import routes
    import_all_modules_from_package('backend.routes')
    #from backend.routes import *
    
    # run the app
    app.run(port=port)