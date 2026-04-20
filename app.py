from flask import Flask, send_from_directory

app = Flask(__name__, static_url_path='', static_folder='.')

@app.route('/')
def index():
    # This matches your folder structure in the screenshot
    return send_from_directory('.', 'templates/index.html')

if __name__ == '__main__':
    # Make sure there are NO spaces before the 'app.run' line below
    app.run(port=8000, debug=True)
