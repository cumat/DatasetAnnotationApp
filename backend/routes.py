from .app import App
from flask import Blueprint, send_from_directory, jsonify, send_file, make_response, request, redirect
import os
from backend.database import Answer, FinalAnswer, Database
import json

from dataset.dataset import LabelGroup
from backend.agreement import fleiss_kappa, cohen_kappa, kappa_to_text
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

# returns an external file
@bp.route('/res/<path:filename>')
def get_res(filename):
    return send_from_directory('.', f'{filename}')

#returns a page.js file that imports all components
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

class LabelIndexCounter:
    def __init__(self) -> None:
        self.current_index = 0
        self.labels_map = {}
    
    def add_label(self, label):
        if label not in self.labels_map:
            self.labels_map[label] = self.current_index + 1
            self.current_index += 1
    def get_count(self):
        return self.current_index + 1
    def get_index(self, label):
        return self.labels_map[label]

class LabelAnswerCompare:
    def __init__(self, user_count : int, label_group: LabelGroup) -> None:
        self.answers = []
        self.user_count = user_count
        self.users = {}
        self.label_group = label_group

    def add_answer(self, label, user):
        self.answers.append(label)
        if label not in self.users:
            self.users[label] = []        
        self.users[label].append(user)
    
    def get_counter(self):
        counted_answers = []
        for answer in self.answers:
            found = False
            for c in counted_answers:
                if self.label_group.compare(answer, c["label"]):
                    c["count"] += 1
                    found = True
                    break
            if not found:
                # add the new answer
                counted_answers.append({
                    "label" : answer,
                    "count" : 1
                })
        return counted_answers
    
    def get_agreement_row(self, label_indexer : LabelIndexCounter) -> list:
        counted_answers = self.get_counter()
        res = []
        # create a row of 0s
        for _ in range(0, label_indexer.get_count()):
            res.append(0)
        for c in counted_answers:
            index = label_indexer.get_index(c["label"])
            res[index] = c["count"]
        return res

    def return_dict(self) -> dict:        
        #counter = Counter(self.answers)
        counted_answers = self.get_counter()
        return [
            {
                "label": c["label"],
                "count": c["count"],
                "percentage": c["count"] / self.user_count * 100  # Convert to percentage
            }
            for c in counted_answers
        ]
    
    def return_dict_with_users(self) -> dict:
        #counter = Counter(self.answers)        
        counted_answers = self.get_counter()

        return [
            {
                "label":  c["label"],
                "percentage": c["count"]  / self.user_count * 100,  # Convert to percentage
                "users" : self.users[c["label"]]
            }
            for c in counted_answers
        ]

@bp.route('/results')
def get_user_results():
    answers = []
    # gather answers from files
    users_answers = get_dataset_results('results/.', dataset.name)
    for d in dataset.get_dataset():
        id = d.id
        
        compare = LabelAnswerCompare(len(users_answers), d.labels)
        
        for ua in users_answers:
            for answer in ua.answers:
                if answer.id == str(id):
                    compare.add_answer(answer.label, ua.user)
                    break
                            
        answers.append({
            "id" : id,
            "title" : d.title,
            "labels" : compare.return_dict(),
            "fix" : db.get_fix(dataset.name, id)
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
    compare = LabelAnswerCompare(len(users_answers), data.labels)
        
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
        "fix" : db.get_fix(dataset.name, id),
        "answers" : compare.return_dict_with_users()
    }

@bp.route('/dataset/fix', methods=['POST'])
def save_dataset_fix():
    req = request.get_json()
    db.insert_or_update_final_answer(FinalAnswer(dataset.name, req["id"], req["label"]))
    return make_response('', 200)
@bp.route('/dataset/agreement')
def get_agreement_kappa():
    users_answers = get_dataset_results('results/.', dataset.name)
    user_count = len(users_answers)
    # no agreement, only one user
    if(user_count <= 1):
        return jsonify(None)
    compared_labels = []
    label_indexer = LabelIndexCounter()
    for d in dataset.get_dataset():
        id = d.id
        
        compare = LabelAnswerCompare(len(users_answers), d.labels)
        
        for ua in users_answers:
            for answer in ua.answers:
                if answer.id == str(id):
                    compare.add_answer(answer.label, ua.user)
                    label_indexer.add_label(answer.label)
                    break
        compared_labels.append(compare)
    
    # create matrix
    matrix = []
    for c in compared_labels:
        matrix.append(c.get_agreement_row(label_indexer))
    print(matrix)

    # if there are 2 users
    # use cohen
    if user_count == 2:
        k = cohen_kappa(matrix[0], matrix[1])
        k_str = "%.2f"%k
        k = fleiss_kappa(matrix)
        k_str = "%.2f"%k
        return jsonify({
            'agreement' : f'{kappa_to_text(k)}',
            'details' : f'Cohen {k_str}'
        })
    else:
        k = fleiss_kappa(matrix)
        k_str = "%.2f"%k
        return jsonify({
            'agreement' : f'{kappa_to_text(k)}',
            'details' : f'Fleiss {k_str}'
        })

# register routes to flask app
def register_blueprint():
    print("registering blueprint")
    app.register_blueprint(bp)