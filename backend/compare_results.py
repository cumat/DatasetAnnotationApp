import os
import json
from collections import defaultdict

def gather_json_files(folder_path):
    """Gather all JSON files from the specified folder."""
    json_files = [f for f in os.listdir(folder_path) if f.endswith('.json')]
    return json_files

def load_json_file(file_path):
    """Load the content of a JSON file."""
    with open(file_path, 'r') as file:
        return json.load(file)
class Answer:
    def __init__(self, id: str, label: str):
        self.id = id
        self.label = label
    def to_dict(self):
        return {
            "id":self.id,
            "label":self.label
        }

class UserAsnwers:
    def __init__(self, user : str, answers : list[Answer]):
        self.user = user
        self.answers = answers
    def to_dict(self):
        return {
            "user" :self.user,
            "answers" : [a.to_dict() for a in self.answers]
        }

def get_dataset_results(folder_path, dataset_name) -> list[UserAsnwers]:
    json_files = gather_json_files(folder_path)
    users = []
    for json_file in json_files:
        file_path = os.path.join(folder_path, json_file)
        data = load_json_file(file_path)
        try:
            if data['dataset'] != dataset_name:
                # not the right dataset result
                continue
            answers = []
            for ans in data["answers"]:
                answers.append(Answer(ans["id"], ans["label"]))
            users.append(UserAsnwers(data['user'], answers))
        except KeyError:
            continue
    return users