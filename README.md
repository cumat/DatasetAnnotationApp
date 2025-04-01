
# Dataset Annotation Web App Documentation

## Introduction

Welcome to the Dataset Annotation Web App! This application allows researchers to upload datasets, annotate them, compare results, resolve conflicts, and save the finalized dataset. Built with Flask for the server-side logic and plain HTML, JavaScript, and CSS for the frontend, this app provides a straightforward way to manage and process data.

For detailed information on how to interact with the core components of the app, refer to the [API Documentation](./API.md). If you're interested in extending the app by adding new types of labels, please see the [Labels Documentation](./LABELS.md).
 
## Examples
To help you get started, there are two included examples: 
- a basic introduction to creating and annotating a dataset [link](./examples/basic/README.md).
- a more complex example using GitHub issues from a repository [link](./examples/github-issues/README.md).
  
These examples can guide you through both simple and advanced use cases.

## Getting started

### Prerequisites
Before you begin, ensure you have the following installed:

- Python 3.x
- Flask (`pip install flask`)
- A modern web browser

### Installation

 - Clone the Repository

```bash
git clone https://github.com/cumat/DatasetAnnotationApp.git
cd DatasetAnnotationApp
```
 - Install Dependencies

```bash
pip install -r requirements.txt
```
- Start the Flask Server
```bash
python main.py
```
The server will start on http://localhost:5000.

**Starting the server on a different port**\
You can start the server on a different port by using the `--port` argument. For example, to start the server on port 8080:
```bash
python main.py --port 8080
```
The server will now start on http://localhost:8080.

## Usage

### Loading Datasets
To load a dataset, implement the get_dataset function in the plugin.py file. This function should create a Dataset class, add labels and data.
To use images or other assets from the frontend start by adding a '/res' before the resource :
```
view = HtmlView()
view.add_img('/res/my-image-path', 'my-img-id')
```
### Annotating Datasets
Once the dataset is loaded:

 - **User Identification**: Annotators must first enter a username (no password required). This ensures that their progress is saved even if they exit the session.
 - **Annotation Process**: The frontend will allow users to annotate the dataset.
 - **Saving Progress**: As users annotate, their progress is saved in a SQLite database.
 - **Downloading Results**: After completing the annotations, users can download their results by clicking a button. The results will be saved in a .json format in the results folder located in the project directory.

### Comparing Results
To compare results:

- **Submitting Results**: All annotators need to submit their .json results. Place these .json files in the results folder.
- **Comparison Tools**: The app will load all the .json results from the results folder and provide tools to compare them.
- **Review & Fix Conflicts**: Annotators can review conflicts and resolve them using the provided interface. Users can also change results even if there are no conflicts.
- **Agreement & Finalization**: The app will show agreement metrics and allow users to finalize their results.

### Saving the Finalized Dataset
After resolving conflicts and completing annotations, you can save the dataset by pressing the download button on the navbar:

Implement save_dataset: Implement the save_dataset function in plugin.py.

Save the results according to your preferred format or method.
This function ensures that the finalized dataset is saved properly after all annotations and conflict resolutions are completed.