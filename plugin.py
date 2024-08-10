from dataset.dataset import Dataset, Data, HtmlView, TextLabelGroup, NumberLabelGroup, NumberValueType, ImageLabelGroup, TimestampLabelGroup


def dataset1() -> Dataset:
    labels = TextLabelGroup()
    labels.add_label("label1").add_label("label2").add_label("label3")
    number_labels = NumberLabelGroup(0, 10)
    view = HtmlView()
    view.add_text("first data")
    dataset = Dataset("test-dataset", blank_labels=False)
    for i in range(1, 10):
        data = Data(i, f"data {i}", view, labels)
        dataset.add_data(data)
    return dataset

def dataset_test() -> Dataset:
    labels = TextLabelGroup()
    labels.add_label("label1").add_label("label2").add_label("label3")
    float_labels = NumberLabelGroup(0, 10)
    int_labels = NumberLabelGroup(0, 10, NumberValueType.INT)

    view = HtmlView()
    view.add_text("first data")
    dataset = Dataset("test-dataset-1")
    dataset.add_data(Data("1", "text labels", view, labels))
    dataset.add_data(Data("2", "float labels", view, float_labels))
    dataset.add_data(Data("3", "int labels", view, int_labels))
    img_view = HtmlView()
    img_view.add_img("/res/road0.png", "road-id")
    img_labels = ImageLabelGroup("road-id")
    dataset.add_data(Data("4", "image label", img_view, img_labels))

    vid_view = HtmlView()
    vid_view.add_external_html("./video-test.html")
    vid_labels = TimestampLabelGroup("timestamp-media")
    dataset.add_data(Data("5", "video label", vid_view, vid_labels))
    return dataset


def get_dataset() -> Dataset:
    return dataset_test()

from dataset.dataset_results import DatasetResults, DatasetDataResult

from dataset.dataset_download_helper import download_as_json

def save_dataset(results: DatasetResults) -> None:
    print(
        "saving dataset results" , results.dataset
    )
    download_as_json(results)
    