@echo off
cd /d "%~dp0"

git pull origin main

python -m pip install flask werkzeug --quiet

start /b python app.py

start chrome "http://127.0.0.1:8000"
exit

