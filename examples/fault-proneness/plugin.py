from dataset.dataset import Dataset, Data, HtmlView, TextLabelGroup, NumberLabelGroup, NumberValueType, ImageLabelGroup, MultiImageLabelGroup, TimestampLabelGroup, MultiTimestampLabelGroup

from dataset.dataset_results import DatasetResults, DatasetDataResult

from dataset.dataset_download_helper import download_as_json
import os

# get dataset implementation
def get_dataset() -> Dataset:
    # create a dataset    
    dataset = Dataset("ai-proneness-replication")
    # create a int label group
    labels = NumberLabelGroup(0, 10, NumberValueType.INT)
    # Directory containing the folders
    base_directory = 'assets'
    # Iterate through the folders
    for i in range(11):  # From 0 to 10
        folder_path = os.path.join(base_directory, str(i))
        file_path = os.path.join(folder_path, 'diff.html')
        view = HtmlView()
        s = f'''
            <div style="width: 100%; height: 100%; display: flex;">
                <iframe src="/res/{file_path}" style="width: 100%; height: 100%; border: none;">
                    Your browser does not support iframes.
                </iframe>
            </div>
        '''
        view.add_html(s)
        #view.add_external_html(file_path)
        dataset.add_data(Data(str(i), f'data {i}', view, labels))
    # return the dataset
    return dataset

# save dataset implementation
def save_dataset(results: DatasetResults) -> None:
    # save the results as a json with the helper function
    download_as_json(results=results, directory=".", filename="results.json")