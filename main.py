from dataset.dataset import Dataset

import argparse

parser = argparse.ArgumentParser(description="Starts the annotation web app")
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

def show_error_server(message):
    from backend.error import start_error_server
    start_error_server(port, message)

def main() :
    try:
        from plugin import get_dataset
    except:
        show_error_server("error importing plugin.py get_dataset\n check if the function is defined.\ndef get_dataset() -> Dataset")
        return
    try:
        import inspect
        from plugin import save_dataset
        sig = inspect.signature(save_dataset)
        # check if it takes only one param
        if len(sig.parameters) != 1:
            raise Exception()
    except:
        show_error_server("error importing plugin.py save_dataset\n check if the function is defined.\ndef save_dataset(results: DatasetResults) -> None")
        return
    try:
        # get dataset
        dataset = get_dataset()
        # check dataset value
        if not isinstance(dataset, Dataset):
            show_error_server("error calling the get_dataset function\n the result is not a Dataset instance")
            return
        if dataset.get_data_count() == 0:
            show_error_server("error calling the get_dataset function\n the result Dataset has no data")
            return
    except:
        show_error_server("error calling the get_dataset function\n check if the function is implemented correctly.\ndef save_dataset(results: DatasetResults) -> None")
        return
    
    from backend.app import App
    # initialize app
    app = App(__name__, './frontend', dataset)
    # import routes
    import_all_modules_from_package('backend.routes')    
    # run the app
    app.run(port=port)

if __name__ == '__main__':
    main()