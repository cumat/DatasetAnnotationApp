from dataset.dataset import Dataset, Data, HtmlView, TextLabelGroup, NumberLabelGroup, NumberValueType, ImageLabelGroup, TimestampLabelGroup

from dataset.dataset_results import DatasetResults, DatasetDataResult

from dataset.dataset_download_helper import download_as_json

# get dataset implementation
def get_dataset() -> Dataset:
    # create a dataset    
    dataset = Dataset("basic-dataset-example")
    # create a text label group
    labels = TextLabelGroup()
    # add labels to the label group
    labels.add_label("label1").add_label("label2").add_label("label3")
    # create an html view for the data
    view = HtmlView()
    view.add_text("An example data for text labels")
    # create and add the data
    dataset.add_data(Data(id="1", title="text label", view=view, labels=labels))

    # create a float label group
    labels = NumberLabelGroup(min=0, max=10, value_type=NumberValueType.FLOAT)
    # create an html view for the data
    view = HtmlView()
    view.add_text("An example data for float labels")
    # create and add the data
    dataset.add_data(Data(id="2", title="float label", view=view, labels=labels))
    
    # create an int label group
    labels = NumberLabelGroup(min=0, max=10, value_type=NumberValueType.INT)
    # create an html view for the data
    view = HtmlView()
    view.add_text("An example data for int labels")
    # create and add the data
    dataset.add_data(Data(id="3", title="int label", view=view, labels=labels))
        
    # choose an id for the image
    img_id = "img-id"
    # create an image label group
    labels = ImageLabelGroup(img_id)
    # create an html view for the data
    view = HtmlView()
    # add an image and set its id with
    view.add_img(f"/res/assets/road0.png", img_id)
    view.add_text("An example data for image labels")
    # create and add the data
    dataset.add_data(Data(id="4", title="image label", view=view, labels=labels))

    # choose an id for the video or audio
    media_id = "media-id"
    # create a timestamp label group
    labels = TimestampLabelGroup(media_id)
    # create an html view for the data
    view = HtmlView()
    # add the external html file containing the video with id="media-id"
    view.add_external_html(f"assets/video-test.html")
    view.add_text("An example data for timestamp labels")
    # create and add the data
    dataset.add_data(Data(id="5", title="timestamp label", view=view, labels=labels))

    # return the dataset
    return dataset

# save dataset implementation
def save_dataset(results: DatasetResults) -> None:
    # save the results as a json with the helper function
    download_as_json(results=results, directory=".", filename="results.json")
    