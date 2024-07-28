from flask import Flask, send_from_directory, jsonify, send_file, make_response
import os

app = Flask(__name__, static_folder='./frontend')

@app.route('/')
def main():
    return send_from_directory(app.static_folder, 'pages/home.html')

@app.route('/<path:filename>')
def get(filename):
    # Check if the filename has an extension
    if not os.path.splitext(filename)[1]:  # No extension
        filename = f"{filename}.js"
    return send_from_directory(app.static_folder, filename)

@app.route('/page.js')
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

if __name__ == '__main__':
    app.run(debug=True)