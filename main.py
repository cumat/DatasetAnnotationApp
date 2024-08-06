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


if __name__ == '__main__':
    # get dataset
    dataset = get_dataset()
    # initialize app
    app = App(__name__, './frontend', dataset)
    # import routes
    from backend.routes import register_blueprint
    # register routes
    register_blueprint()
    # run the app
    app.run(port=port)