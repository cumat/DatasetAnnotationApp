from dataset.dataset import Dataset, Data, HtmlView, MultiImageLabelGroup
from dataset.dataset_results import DatasetResults
from dataset.dataset_download_helper import download_as_json
import os

folder_path = "assets/road-signs-images"

# get dataset implementation
def get_dataset() -> Dataset:
    dataset = Dataset("road-signs-example")
    image_id = 'img_id'
    image_labels = MultiImageLabelGroup(image_id, ['traffic-light', 'road-sign'])
    curr_id = 0
    for filename in os.listdir(folder_path):
        if filename.endswith('.png'):
            file_path = os.path.join('/res/assets/road-signs-images', filename)
            view = HtmlView()
            view.add_img(file_path, image_id, width=600)
            dataset.add_data(Data(
                id=str(curr_id),   
                title=filename,
                view=view,
                labels=image_labels
            ))
            curr_id += 1
    # return the dataset
    return dataset

# save dataset implementation
def save_dataset(results: DatasetResults) -> None:
    # save the results as a json with the helper function
    download_as_json(results=results, directory=".", filename="results.json")