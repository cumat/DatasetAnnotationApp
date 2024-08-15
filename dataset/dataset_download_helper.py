from .dataset_results import DatasetResults
import json
import os

def write_to_file(directory_path: str, filename: str, data: str) -> None:
    """
    Writes data to a file at the specified directory path. Creates directories if they do not exist.

    :param directory_path: Path to the directory where the file should be created.
    :param filename: Name of the file to be created.
    :param data: Content to be written to the file.
    """
    # Combine directory path and filename to get the full path
    file_path = os.path.join(directory_path, filename)
    
    # Create directories if they do not exist
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    # Write data to the file
    with open(file_path, 'w') as file:
        file.write(data)

def download_as_json(results: DatasetResults, directory: str = "."):
    return write_to_file(directory, f'{results.dataset}-results.json', json.dumps(results.to_dict()))