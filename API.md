# API Reference

## Classes and Constructors

### `Dataset`

- **Description:** Represents a collection of data items.
- **Constructor Parameters:**
  - `name` (str): The name of the dataset.
  - `blank_labels` (bool, optional, default: `True`): Indicates whether blank labels are allowed in the dataset.
- **Attributes:**
  - `name` (str): Name of the dataset.
  - `dataset` (dict): Dictionary of data items keyed by ID.
  - `dataset_order` (list of `Data`): Ordered list of data items.
  - `allow_blank_labels` (bool): Flag indicating if blank labels are allowed.
- **Methods:**
  - `add_data(data: Data) -> Dataset`: Adds a `Data` object to the dataset.
  - `get_data_count() -> int`: Returns the number of data items in the dataset.
  - `get_indices_from_ids(ids: list[tuple[str]]) -> list[int]`: Retrieves indices from a list of IDs.
  - `get_dataset() -> list[Data]`: Returns the list of `Data` objects in the dataset.
  - `get_data(index: int) -> Data`: Retrieves a `Data` object by index.
  - `get_data_by_id(id: str) -> Data`: Retrieves a `Data` object by its ID.

### `Data`

- **Description:** Represents a single data item in the dataset.
- **Constructor Parameters:**
  - `id` (str): Unique identifier for the data item.
  - `title` (str): Title of the data item.
  - `view` (`HtmlView`): HTML view associated with the data item.
  - `labels` (`LabelGroup`): Labels associated with the data item.
- **Attributes:**
  - `id` (str): Unique identifier for the data item.
  - `title` (str): Title of the data item.
  - `view` (`HtmlView`): HTML view of the data item.
  - `labels` (`LabelGroup`): Labels associated with the data item.

### `HtmlView`

- **Description:** Represents the HTML view of a data item.
- **Constructor Parameters:**
  - None
- **Attributes:**
  - `content` (str): The accumulated HTML content.
- **Methods:**
  - `add_html(content: str) -> HtmlView`: Adds HTML content to the view.
  - `add_style(res_source : str) -> HtmlView`: Adds a stylesheet link with res_source as href.
  - `add_text(text: str) -> HtmlView`: Adds a text paragraph to the view.
  - `add_img(source: str, id: str | None) -> HtmlView`: Adds an image to the view.
  - `add_external_html(source_path: str) -> HtmlView`: Adds HTML content from an external file.

### `TextLabelGroup` (Inherits from `LabelGroup`)

- **Description:** Represents a group of text labels.
- **Constructor Parameters:**
  - None
- **Methods:**
  - `add_label(label: str) -> TextLabelGroup`: Adds a new text label to the group.

### `NumberLabelGroup` (Inherits from `LabelGroup`)

- **Description:** Represents a group of numeric labels.
- **Constructor Parameters:**
  - `min` (float, optional, default: `sys.float_info.min`): Minimum value for the numeric labels.
  - `max` (float, optional, default: `sys.float_info.max`): Maximum value for the numeric labels.
  - `value_type` (`NumberValueType`, optional, default: `NumberValueType.FLOAT`): The type of numeric values (`INT` for integers, `FLOAT` for floating-point numbers).

### `ImageLabelGroup` (Inherits from `LabelGroup`)

- **Description:** Represents a group of image labels, specifically for bounding boxes.
- **Constructor Parameters:**
  - `img_id` (str): Identifier for the image associated with the label group.

### `TimestampLabelGroup` (Inherits from `LabelGroup`)

- **Description:** Represents a group of timestamp labels.
- **Constructor Parameters:**
  - `media_id` (str): Identifier for the media associated with the timestamp labels.

