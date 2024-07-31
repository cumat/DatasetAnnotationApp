from .app import App
from flask import Blueprint, send_from_directory, jsonify, send_file, make_response
import os

bp = Blueprint('routes',__name__)
app = App.get_app()
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

@bp.route('/annotate')
def send_annotate_page():
    return send_page('annotate.html')

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

@bp.route('/dataset/<index>')
def get_data_at(index):
    try:
        index = int(index)
        data = dataset.get_data(index)
        res = {
            "dataset" : dataset.name,
            "id" : data.id,
            "title" : data.title,
            "labels" : data.labels.send_json(),
            "html" : data.view.content,
            "steps" : {
                "count" : 3,
                "completed" : []
            }
        }
        return jsonify(res)
    except ValueError:
        return jsonify(None)

# register routes to flask app
def register_blueprint():
    print("registering blueprint")
    app.register_blueprint(bp)