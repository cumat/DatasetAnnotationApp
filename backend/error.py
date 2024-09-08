from flask import Flask, redirect, render_template, send_from_directory
import os

def start_error_server(port, error_message):
    # Initialize Flask app
    template_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../frontend/pages')
    app = Flask(__name__, static_folder='../frontend',template_folder=template_dir)

    def send_file(filepath):
        return send_from_directory(app.static_folder, filepath)
    @app.route('/')
    def main_route():
        return render_template('error.html',error_message=error_message)
    # returns a frontend file
    @app.route('/<path:filename>')
    def get(filename):
        return send_file(filename)
    @app.errorhandler(404)
    def page_not_found(e):
        return redirect('/')
    # Run the Flask server on the specified port
    app.run(port=port)
