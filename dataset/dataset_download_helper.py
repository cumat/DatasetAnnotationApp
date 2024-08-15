from .dataset_results import DatasetResults
import json
import os
import csv
import io

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

def download_as_json(results: DatasetResults, directory: str = ".", filename: str | None = None):
    if filename == None:
        filename = f'{results.dataset}-results.json'
    print(filename)
    return write_to_file(directory, filename, json.dumps(results.to_dict()))


def download_annotated_csv(results: DatasetResults, csv_filepath: str, new_csv_filepath: str,  id_key: str = "id", annotation_key:str = 'annotation'):
    # Read the existing CSV file
    with open(csv_filepath, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        fieldnames = reader.fieldnames
        rows = list(reader)

    # Create a dictionary for quick lookup of labels by id
    id_to_label = {str(result.id): result.label for result in results.results}
    
    # Add the new column if it doesn't exist
    if annotation_key not in fieldnames:
        fieldnames.append(annotation_key)

    # Update rows with annotation labels
    for row in rows:
        row_id = row[id_key]
        row[annotation_key] = id_to_label.get(str(row_id), '')

    # Create the new CSV content
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)
    csv_content = output.getvalue()
    output.close()
    # Write the new CSV file to disk
    # Combine directory path and filename to get the full path
    file_path = os.path.join(".", new_csv_filepath)
    
    # Create directories if they do not exist
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    # Write data to the file
    with open(file_path, mode='w', newline='', encoding='utf-8') as file:
        file.write(csv_content)