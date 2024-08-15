from backend.app import App
from flask import Blueprint, jsonify, make_response, request
from backend.database import Answer, FinalAnswer

from backend.agreement import fleiss_kappa, cohen_kappa, kappa_to_text
from backend.compare_results import get_dataset_results
from dataset.label_compare import LabelAnswerCompare, LabelIndexCounter

# import save dataset plugin function

bp = Blueprint('dataset-routes',__name__)
app = App.get_app()
db = App.get_db()
dataset = App.get_dataset()

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
    
@bp.route('/dataset/results')
def get_user_results():
    answers = []
    # gather answers from files
    users_answers = get_dataset_results('results/.', dataset.name)
    if users_answers.__len__() == 0:
        return {
            "answers" : answers
        }
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
    
@bp.route('/dataset/at/<id>')
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

app.register_blueprint(bp)