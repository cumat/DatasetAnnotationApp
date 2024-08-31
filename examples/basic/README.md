
# Basic Example: Creating and Saving a Dataset

This document provides a step-by-step explanation of how to create a simple dataset with various label types and how to save the results.

## 1. Creating the Dataset

The function `get_dataset()` is responsible for creating a dataset that contains different types of labels, such as text labels, number labels (both integer and float), image labels, and timestamp labels.

### Steps Involved:

### 1.1. Initialize the Dataset

```python
dataset = Dataset("basic-dataset-example")
```

- A `Dataset` object is created with the name `"basic-dataset-example"`. This dataset will store and manage all the data entries.

### 1.2. Add Text Labels

```python
labels = TextLabelGroup()
labels.add_label("label1").add_label("label2").add_label("label3")
```

- A `TextLabelGroup` object is created to manage a group of text labels.
- Three labels, `"label1"`, `"label2"`, and `"label3"`, are added to this label group.

```python
view = HtmlView()
view.add_text("An example data for text labels")
dataset.add_data(Data(id="1", title="text label", view=view, labels=labels))
```

- An `HtmlView` object is created to define the HTML content that will be displayed for this data entry.
- A text string `"An example data for text labels"` is added to the view.
- The `Data` object is created with an `id` of `"1"`, a `title` of `"text label"`, and is associated with the view and label group created earlier. This data entry is then added to the dataset.

### 1.3. Add Number Labels (Float)

```python
labels = NumberLabelGroup(min=0, max=10, value_type=NumberValueType.FLOAT)
view = HtmlView()
view.add_text("An example data for float labels")
dataset.add_data(Data(id="2", title="float label", view=view, labels=labels))
```

- A `NumberLabelGroup` object is created to manage numeric labels, with values ranging from `0` to `10`, and the `value_type` set to `FLOAT`.
- The data is given an `id` of `"2"`, a `title` of `"float label"`, and the view is updated to reflect this with the corresponding text. This data entry is then added to the dataset.

### 1.4. Add Number Labels (Integer)

```python
labels = NumberLabelGroup(min=0, max=10, value_type=NumberValueType.INT)
view = HtmlView()
view.add_text("An example data for int labels")
dataset.add_data(Data(id="3", title="int label", view=view, labels=labels))
```

- A `NumberLabelGroup` object is created to manage numeric labels, with values ranging from `0` to `10`, and the `value_type` set to `INT`.
- The data is given an `id` of `"3"`, a `title` of `"int label"`, and the view is updated to reflect this with the corresponding text. This data entry is then added to the dataset.

### 1.5. Add Image Labels

```python
img_id = "img-id"
labels = ImageLabelGroup(img_id)
view = HtmlView()
view.add_img(f"/res/assets/road0.png", img_id)
view.add_text("An example data for image labels")
dataset.add_data(Data(id="4", title="image label", view=view, labels=labels))
```

- An `ImageLabelGroup` object is created with a unique `img_id` representing the id tag on the img html element.
- The `HtmlView` object is updated to include an image, referenced by its path `"/res/assets/road0.png"`, the `/res` is used to allow the server to access files, the real image path is `assets/road0.png`.
- The data is given an `id` of `"4"`, a `title` of `"image label"`, and added to the dataset.

### 1.6. Add Timestamp Labels (Video/Audio)

```python
media_id = "media-id"
labels = TimestampLabelGroup(media_id)
view = HtmlView()
view.add_external_html(f"assets/video-test.html")
view.add_text("An example data for timestamp labels")
dataset.add_data(Data(id="5", title="timestamp label", view=view, labels=labels))
```

- A `TimestampLabelGroup` object is created to manage timestamp labels for a media file, identified by `media_id`.
- The `HtmlView` object includes an external HTML file that contains a video or audio element with `id="media-id"`.
```html
<!-- Video -->
<video id="media-id" width="100%" controls>
    <source src="/res/assets/vid.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
<!-- Audio -->
<audio id="media-id" controls>
    <source src="/res/assets/vid.mp4" type="video/mp4">
    Your browser does not support the audio tag.
</audio>

```
- The data is given an `id` of `"5"`, a `title` of `"timestamp label"`, and added to the dataset.

### 1.7. Return the Dataset

```python
return dataset
```

- The fully constructed `Dataset` object is returned.

## 2. Saving the Dataset Results

The `save_dataset(results: DatasetResults)` function is responsible for saving the dataset results to a JSON file.

```python
def save_dataset(results: DatasetResults) -> None:
    download_as_json(results=results, directory=".", filename="results.json")
```

- The `download_as_json` helper function is used to save the dataset results in the current directory with the name `results.json`.

## Conclusion

This example demonstrates how to create and save a dataset with various types of labels. The code showcases how to set up text, number, image, and timestamp labels, associate them with data entries, and finally, how to save the dataset results to a file.
