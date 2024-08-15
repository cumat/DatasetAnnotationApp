## Add a New Label

To add a new label group to your dataset, you need to create a subclass of `LabelGroup`. Each label group must implement two core methods: `send_json` and `compare`.

### Required Methods for a Label Group

#### `send_json`

- **Description:** Converts the label group data into a dictionary format that can be utilized by the frontend.
- **Return Type:** `dict`
- **Dictionary Structure:**
  - `component` (str): A string identifying the type of html-element, such as `"text-labels"`, `"number-labels"`, `"image-label"`, or `"timestamp-label"`.
  - `data` (varies): The actual label data, which differs based on the label group implementation. This is what the frontend will use to populate the label selection and display.

  The frontend expects this dictionary to be processed by a corresponding HTML element (e.g., `<text-labels>`, `<number-labels>`, etc.) with the following methods:

  - `setLabels(data, answer, onSelectCallback)`: 
    - `data` (varies): The data passed from `send_json`. This should be structured based on the label group type. For example, in a text label group, this would be a list of text labels.
    - `answer` (String | null): The current selected label. If no label is selected, this can be `null`.
    - `onSelectCallback` (Function): A callback function to be triggered when the user selects a new label. This function will receive the selected label as a parameter. It is used to update the selection state and handle user interaction.

  - `setSelectedLabel(label)`:
    - `label` (String | null): The label that should be set as the currently selected label. If there is no selection, this can be `null`.

#### `compare`

- **Description:** Compares two label values to determine if they are considered equal.
- **Parameters:**
  - `data1` (str): The first label value to compare.
  - `data2` (str): The second label value to compare.
- **Return Type:** `bool`
- **Returns:** `True` if the two label values are considered equal; `False` otherwise.

### Adding a New HTML Component

To ensure that your new label group is correctly integrated with the frontend:

1. **Create the HTML Component:**
   - Add your custom HTML component to the `frontend/components` directory. This component should match the `component` value specified in the `send_json` method of your label group class.

2. **Register the Component:**
   - Use the following JavaScript code to define and register your HTML component:

     ```javascript
     customElements.define('element-name', class extends HTMLElement {
       // Your component implementation
       setLabels(data, answer, onSelectCallback){
        // Create and show the element
       }

       setSelectedLabel(label){
        // Update the element with the new label value
       }
     });
     ```

   - Replace `'element-name'` with the appropriate HTML tag name for your component (e.g., `<text-labels>`, `<number-labels>`, etc.).

   - Ensure that the component implements the `setLabels` and `setSelectedLabel` methods as described above.

By following these steps, you will ensure that your new label group is properly displayed and managed within the web application.

### Existing Implementations

#### `TextLabelGroup`

- **`send_json` Implementation:**
  - Returns a dictionary with `component` set to `"text-labels"` and `data` containing a list of text labels.

- **`compare` Implementation:**
  - Checks if two text labels are identical.

#### `NumberLabelGroup`

- **`send_json` Implementation:**
  - Returns a dictionary with `component` set to `"number-labels"`, `data` containing `min`, `max`, and `step` values.

- **`compare` Implementation:**
  - Compares two numeric labels considering value type (integer or floating-point) and rounding for floating-point values.

#### `ImageLabelGroup`

- **`send_json` Implementation:**
  - Returns a dictionary with `component` set to `"image-label"` and `data` containing `imageId`.

- **`compare` Implementation:**
  - Compares two image labels based on bounding box intersection and tolerance.

#### `TimestampLabelGroup`

- **`send_json` Implementation:**
  - Returns a dictionary with `component` set to `"timestamp-label"` and `data` containing `mediaId`.

- **`compare` Implementation:**
  - Compares two timestamp labels based on start and end times within a specified tolerance.


