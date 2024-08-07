from .app import App
from flask import Blueprint, send_from_directory, jsonify, send_file, make_response, request, redirect
import os
from backend.database import Answer, FinalAnswer, Database
import json

from collections import Counter

bp = Blueprint('routes',__name__)
app = App.get_app()
db = App.get_db()
dataset = App.get_dataset()


def send_page(filename):
    return send_from_directory(app.static_folder, f'pages/{filename}')

def send_file(filepath):
    return send_from_directory(app.static_folder, filepath)

# returns the home page
@bp.route('/')
def main():
    return send_page('home.html')

@bp.route('/login')
def send_login_page():
    return send_page('login.html')

@bp.route("/review/", defaults={'user': None})
@bp.route('/annotate/<user>')
def send_annotate_page_with_user(user):
    if(user is None):
        return redirect('/login')
    return send_page('annotate.html')

@bp.route('/annotate')
def send_annotate_page():
    return redirect('/login')

@bp.route('/compare')
def send_compare_page() :
    return send_page('compare.html')

# returns the file
@bp.route('/<path:filename>')
def get(filename):
    # Check if the filename has an extension
    if not os.path.splitext(filename)[1]:  # No extension
        filename = f"{filename}.js"
    return send_file(filename)

# returns a page.js file that imports all components
@bp.route('/page.js')
def serve_page_js():
    components_dir = os.path.join(app.static_folder, 'components')
    js_files = []

    try:
        # Collect all component .js file paths
        for root, dirs, files in os.walk(components_dir):
            for file in files:
                if file.endswith('.js'):
                    relative_path = os.path.relpath(os.path.join(root, file), components_dir)
                    js_files.append(relative_path)
        
        # Generate the JavaScript file content
        imports = [f"import '/components/{path.replace(os.sep, '/')}';" for path in js_files]
        js_content = '\n'.join(imports)

        # Create the response with the JavaScript content
        response = make_response(js_content)
        response.headers['Content-Type'] = 'application/javascript'
        return response

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def find_uncompleted_indices(max_index, current_index, completed_indices):
    # Convert completed indices to a set for faster lookup
    completed_set = set(completed_indices)
    
    # Find the previous uncompleted index
    prev_index = None
    for i in range(current_index - 1, -1, -1):
        if i not in completed_set:
            prev_index = i
            break
    
    # Find the next uncompleted index
    next_index = None
    for i in range(current_index + 1, max_index + 1):
        if i not in completed_set:
            next_index = i
            break
    
    return prev_index, next_index

@bp.route('/dataset/<user>/<index>')
def get_data_at(user, index):
    try:
        index = int(index)
        # check if index is valid
        if dataset.get_data_count() <= index:
            return jsonify(None)
        data = dataset.get_data(index)
        answer = db.get_user_answer(user, dataset.name, data.id)
        answers = db.get_user_answers_id(user, dataset.name)
        indices = dataset.get_indices_from_ids(answers)
        prev, next = find_uncompleted_indices(dataset.get_data_count() - 1, index, indices)

        res = {
            "dataset" : dataset.name,
            "id" : data.id,
            "title" : data.title,
            "labels" : data.labels.send_json(),
            "html" : data.view.content,
            "answer" : answer,
            "steps" : {
                "count" : dataset.get_data_count(),
                "complete" : len(answers),
                "completedSteps" : indices,
                "next" : next,
                "prev" : prev
            }
        }
        return jsonify(res)
    except ValueError:
        return jsonify(None)

@bp.route('/dataset/<user>', methods=['POST'])
def save_dataset_label( user):
    req= request.get_json()
    print('saving dataset data: ', req)
    db.insert_or_update_answer(Answer(user,dataset.name, req["id"], req["label"]))
    return make_response('', 200)

@bp.route('/dataset/name')
def get_dataset_name():
    return jsonify({
        "dataset" : dataset.name
    })

@bp.route('/download/dataset/<user>')
def download_user_results(user):
    res = {}
    res["user"] = user
    res["dataset"] = dataset.name
    answers = []
    for id, label in db.get_user_answers(user, dataset.name):
        if label != None:
            answers.append({
                "id" : id,
                'label' : label})
    if not dataset.allow_blank_labels and len(answers) != dataset.get_data_count():
        return jsonify({
            "msg" : "Complete all the dataset first",
            "success" : False
        })
    res["answers"] = answers
    directory = 'results'
    file_name = f'{user}-results.json'
    file_path = os.path.join(directory, file_name)
    # Ensure the directory exists
    os.makedirs(directory, exist_ok=True)

    try:
        with open(file_path, 'w') as f:
            json.dump(res, f, indent=4)

        return jsonify({
        "msg" : "results downloaded successfully",
        "success" : True
    })
    except:
        return jsonify(None)
    
from backend.compare_results import get_dataset_results

class LabelAnswerCompare:
    def __init__(self, user_count) -> None:
        self.answers = []
        self.user_count = user_count
        self.users = []

    def add_answer(self, label, user):
        self.answers.append(label)
        self.users.append(user)
                            
    def return_dict(self) -> dict:
        
        counter = Counter(self.answers)        

        return [
            {
                "label": string,
                "count": count,
                "percentage": count / self.user_count * 100  # Convert to percentage
            }
            for string, count in counter.items()
        ]
    
    def return_dict_with_users(self) -> dict:
        counter = Counter(self.answers)        

        return [
            {
                "label": string,
                "percentage": count / self.user_count * 100,  # Convert to percentage
                "users" : self.users
            }
            for string, count in counter.items()
        ]

@bp.route('/results')
def get_user_results():
    answers = []
    # gather answers from files
    users_answers = get_dataset_results('results/.', dataset.name)
    for d in dataset.get_dataset():
        id = d.id
        
        compare = LabelAnswerCompare(len(users_answers))
        
        for ua in users_answers:
            for answer in ua.answers:
                if answer.id == str(id):
                    compare.add_answer(answer.label, ua.user)
                    break                    
        answers.append({
            "id" : id,
            "title" : d.title,
            "labels" : compare.return_dict(),
            "fix" : None
        })
    return {
        "answers" : answers
    }

@bp.route('/compare/<id>')
def send_compare_at_page(id):
    return send_page('compare_at.html')

@bp.route('/compare-at/<id>')
def send_compare_results(id):
    # gather answers from files
    users_answers = get_dataset_results('results/.', dataset.name)
    data = dataset.get_data_by_id(id)
    compare = LabelAnswerCompare(len(users_answers))
        
    for ua in users_answers:
        for answer in ua.answers:
            if answer.id == str(id):
                compare.add_answer(answer.label, ua.user)
                break        
    return {
        "dataset" : dataset.name,
        "id" : data.id,
        "title" : data.title,
        "labels" : data.labels.send_json(),
        "html" : data.view.content,
        "fix" : None,
        "answers" : compare.return_dict_with_users()
    }

# register routes to flask app
def register_blueprint():
    print("registering blueprint")
    app.register_blueprint(bp)