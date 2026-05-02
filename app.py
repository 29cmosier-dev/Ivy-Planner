from flask import Flask, send_from_directory
import subprocess

app = Flask(__name__, static_url_path='', static_folder='.')

@app.route('/')
def index():
    return send_from_directory('.', 'templates/index.html')

@app.route('/get-version')
def get_version():
    try:
        version = subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode('ascii').strip()
        return {"version": version}
    except Exception as e:
        return {"version": "unknown", "error": str(e)}, 500

if __name__ == '__main__':
    app.run(port=8000, debug=True)
