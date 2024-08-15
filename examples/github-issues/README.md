
# Dataset Annotation Example with GitHub Issues CSV

This example demonstrates how to create a dataset from a CSV file containing GitHub issues, and save the results. The GitHub issues used in this example are from the repository [nlbse2023/issue-report-classification](https://github.com/nlbse2023/issue-report-classification). The process involves writing the get_dataset function that loads the CSV and prepares the data with appropriate labels; writing the save_dataset function saving the annotated results back into a new CSV file.

## Step-by-Step Explanation

### 1. Importing Necessary Modules

```python
from dataset.dataset import Dataset, Data, HtmlView, TextLabelGroup
from dataset.dataset_results import DatasetResults
from dataset.dataset_download_helper import download_as_json, download_annotated_csv
import pandas as pd
from html import escape
import markdown
```

The code starts by importing the necessary modules:
- `Dataset`, `Data`, `HtmlView`, `TextLabelGroup`: Core classes for managing the dataset and individual data items.
- `DatasetResults`: To manage the results of the annotation process.
- `download_as_json`, `download_annotated_csv`: Utility functions to save the annotated results in different formats.
- `pandas`: A powerful data manipulation library to handle the CSV file.
- `html.escape` and `markdown`: Utilities to process and convert CSV content to HTML (not crucial for the dataset creation).

### 2. Reading and Converting the CSV File

The CSV file containing GitHub issues is read using pandas, and each row is converted into a data entry in the dataset:

```python
csv_file_path = 'assets/100-issue-classification.csv'
```

### 3. Creating the Dataset and Label Group

A `Dataset` is created to hold the data. A `TextLabelGroup` is created to define the possible labels for each data item:

```python
dataset = Dataset("github-issues")
labels = TextLabelGroup()
labels.add_label("bug").add_label("feature").add_label("question").add_label("documentation")
```


### 4. Adding Data to the Dataset

The CSV is iterated row by row, and for each issue:

1. **Creating an `HtmlView`**:
   - An `HtmlView` is created to hold the content of the issue, such as labels, author information, and the issue's body.

2. **Adding a Style**:
   - The `styles.css` file is added to the view using `view.add_style("/res/assets/styles.css")`. This CSS file is used to mimic the look and feel of markdown, ensuring the content appears as it would on GitHub.

3. **Displaying Current Labels**:
   - The current labels associated with the issue are displayed in a `<div>` element. This helps in visually presenting the labels that are already assigned to the issue.

   ```python
   view.add_html(f'<div> {row["labels"]} </div>')
   ```

4. **Showing the Author Association**:
   - The association of the author (e.g., collaborator, member, contributor) is shown in an `<h3>` element. This provides context on who reported the issue.

   ```python
   view.add_html(f'<h3> {row["author_association"]} </h3>')
   ```

5. **Converting and Adding the Issue Body**:
   - The `convert_csv_body_to_html` function is used to convert the body of the issue from markdown format to HTML. This function handles code blocks, tables, and other markdown elements, ensuring they are properly rendered in HTML.

   - The converted body is then added to the view. This allows the issue's description, steps to reproduce, and other details to be displayed as they would appear on GitHub.

   ```python
   view.add_html(convert_csv_body_to_html(row["body"]))
   ```

6. **Adding Data to the Dataset**:
   - Finally, the data is added to the dataset using `dataset.add_data(Data(id=row["id"], title=row["title"], view=view, labels=labels))`. This ensures that each GitHub issue is properly represented in the dataset, with its corresponding labels and content.

   ```python
   dataset.add_data(Data(id=row["id"], title=row["title"], view=view, labels=labels))
   ```

This process repeats for each row in the CSV, building a complete dataset that includes all the issues, their labels, and other relevant details.



### 5. Saving the Annotated Results

Once the annotations are complete, the results can be saved back into a new CSV file. The `download_annotated_csv` function is used to create a new CSV file containing the original data along with the annotations:

```python
download_annotated_csv(
    results=results,
    csv_filepath=csv_file_path,
    new_csv_filepath='results.csv',
    id_key='id',
    annotation_key='annotation'
)
```

This will create a new CSV file named `results.csv`, which will include an additional `annotation` column with the labels assigned to each GitHub issue.

## Summary

In summary, this code snippet illustrates how to load a CSV file of GitHub issues, convert it into a dataset, label the data, and finally save the results in a new CSV file. The labels used in this example are `bug`, `feature`, `question`, and `documentation`.
