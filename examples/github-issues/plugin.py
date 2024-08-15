from dataset.dataset import Dataset, Data, HtmlView, TextLabelGroup

from dataset.dataset_results import DatasetResults

from dataset.dataset_download_helper import download_as_json, download_annotated_csv

import pandas as pd

from html import escape
import markdown

csv_file_path = 'assets/100-issue-classification.csv'

def convert_csv_body_to_html(body):
    # Split the data into lines
    lines = body.splitlines()
    
    group = "none"
    group_str = ""
    html_output = ""
    table = "none"
    table_str = ""
    for line in lines :
        if "```" in line:
            if group == "none":                
                group = "start"
            else :
                group = "end"
        if '|' in line and group == "none":
            table = "start"
        else :
            if table != "none":
                table = "end"
        if group == "start":        
            group = "process"

        elif group == "process":
            group_str +=  f'<pre>{escape(line)}</pre>'

        elif group == "end":
            html_output += f"<div class='markdown-code'> {group_str} </div>"

            group = "none"
            group_str = ""
        elif table  == "start":
            table_str += line + '\n'
            pass
        elif table == "end":
            table_html = markdown.markdown(table_str, extensions=['tables'])
            table_html = table_html.replace('<table>','<table class="markdown-table">')
            html_output += table_html
            table == "none"
            table_str = ""
            pass
        else:
            html_output += markdown.markdown(line)
    return f'<div class="csv-content-container">{html_output}</div>'

# get dataset implementation
def get_dataset() -> Dataset:
    # create a dataset    
    dataset = Dataset("github-issues")
    # create a text label group
    labels = TextLabelGroup()
    # add labels to the label group
    labels.add_label("bug").add_label("feature").add_label("question").add_label("documentation")
    # read the csv
    file_path = csv_file_path
    csv = pd.read_csv(file_path)
    # loop through the csv
    for _, row in csv.iterrows():
        # create the html view for each data
        view = HtmlView()
        view.add_style("/res/assets/styles.css")
        view.add_html(f'<div> {row['labels']} </div>')
        view.add_html(f'<h3> {row['author_association']} </h3>')
        view.add_html(convert_csv_body_to_html(row['body']))
        # add a new data to the dataset
        dataset.add_data(Data(id=row['id'], title=row['title'], view=view, labels=labels))
    # return the dataset
    return dataset

# save dataset implementation
def save_dataset(results: DatasetResults) -> None:
    # save the results as a json with the helper function
    download_annotated_csv(
        results=results,                # the DatasetResults
        csv_filepath=csv_file_path,     # the old csv filename
        new_csv_filepath='results.csv', # the new filename
        id_key='id',                    # to find the right data
        annotation_key='annotation'     # adds this key with the new label
        )
    