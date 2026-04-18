import os
from flask import Flask, request, render_template
from werkzeug.utils import secure_filename
import webbrowser
from threading import Timer


app = Flask(__name__)

# This matches your existing folder structure
UPLOAD_FOLDER = 'uploads/images'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    # This will look for your index.html file in the root
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'background_image' not in request.files:
        return 'No file part'
    
    file = request.files['background_image']
    
    if file.filename == '':
        return 'No selected file'
    
    if file:
        filename = secure_filename(file.filename)
        # Saves directly to your /uploads/images folder
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return 'Image saved to uploads/images!'
    
def open_browser():
      webbrowser.open_new('http://127.0.0.1:8000/templates')


if __name__ == '__main__':
    Timer(1, open_browser).start() # Opens the browser 1 second after starting
    app.run(port=8000)

