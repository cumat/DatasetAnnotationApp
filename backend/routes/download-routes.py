from backend.app import App
from flask import Blueprint, jsonify
import os
import json
from backend.compare_results import get_dataset_results
from dataset.label_compare import LabelAnswerCompare
from dataset.dataset_results import DatasetResults

# import save dataset plugin function
from plugin import save_dataset
bp = Blueprint('download-routes',__name__)
app = App.get_app()
db = App.get_db()
dataset = App.get_dataset()

@bp.route('/download/dataset')
def download_fixed_dataset():
    res = DatasetResults(dataset.name)
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
        
        answer = compare.get_answer_or_none()
        if answer is not None:
            # push in the results
            res.append_result(id, answer)
            pass
        else:
            # check for a fix
            fix = db.get_fix(dataset.name, id)
            if fix is not None:
                # push fix
                res.append_result(id, fix)
                pass
            else :
                # there are some conflicts 
                # or unanswered questions
                return jsonify({
                    "msg" : "the dataset has still some conflicts left",
                    "success" : False
                })
            pass
    # call download function with dataset
    save_dataset(res)
    return jsonify({
        "msg" : "dataset results saved successfully",
        "success" : True
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
    file_name = f'{dataset.name}-{user}-results.json'
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

app.register_blueprint(bp)