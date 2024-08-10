from backend.app import App
from flask import Blueprint, send_from_directory, jsonify, send_file, make_response, redirect
import os


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

@bp.route('/compare/<id>')
def send_compare_at_page(id):
    return send_page('compare_at.html')

# returns a frontend file
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


app.register_blueprint(bp)