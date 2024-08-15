from dataset.dataset import Dataset, Data, HtmlView, TextLabelGroup
from dataset.dataset_results import DatasetResults

# get dataset implementation
def get_dataset() -> Dataset:
    raise NotImplementedError("The 'get_dataset' function has not been implemented yet.")

# save dataset implementation
def save_dataset(results: DatasetResults) -> None:
    raise NotImplementedError("The 'save_dataset' function has not been implemented yet.")